module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction

      middleware.do_not_use Dynflow::Middleware::Common::Transaction
      middleware.use Actions::Middleware::HideSecrets

      def queue
        ForemanRemoteExecution::DYNFLOW_QUEUE
      end

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy_selector = ::RemoteExecutionProxySelector.new, options = {})
        action_subject(host, :job_category => job_invocation.job_category, :description => job_invocation.description)

        template_invocation.host_id = host.id
        template_invocation.run_host_job_task_id = task.id
        template_invocation.save!

        link!(job_invocation)
        link!(template_invocation)

        verify_permissions(host, template_invocation)

        raise _('Could not use any template used in the job invocation') if template_invocation.blank?

        provider_type = template_invocation.template.provider_type.to_s
        proxy = determine_proxy!(proxy_selector, provider_type, host)

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _('Failed rendering template: %s') % renderer.error_message unless script

        provider = template_invocation.template.provider

        additional_options = { :hostname => provider.find_ip_or_hostname(host),
                               :script => script,
                               :execution_timeout_interval => job_invocation.execution_timeout_interval,
                               :secrets => secrets(host, job_invocation, provider),
                               :use_batch_triggering => true}
        action_options = provider.proxy_command_options(template_invocation, host)
                                 .merge(additional_options)

        plan_delegated_action(proxy, provider.proxy_action_class, action_options)
        plan_self
      end

      def finalize(*args)
        update_host_status
        check_exit_status
      end

      def secrets(host, job_invocation, provider)
        job_secrets = { :ssh_password => job_invocation.password,
                        :key_passphrase => job_invocation.key_passphrase,
                        :sudo_password => job_invocation.sudo_password }

        job_secrets.merge(provider.secrets(host)) { |_key, job_secret, provider_secret| job_secret || provider_secret }
      end

      def check_exit_status
        error! ForemanTasks::Task::TaskCancelledException.new(_('Task cancelled')) if delegated_action && delegated_action.output[:cancel_sent]
        error! _('Job execution failed') if exit_status.to_s != '0'
      end

      def live_output
        continuous_output.sort!
        continuous_output.raw_outputs
      end

      def humanized_input
        N_('%{description} on %{host}') % { :host => input[:host].try(:[], :name),
                                            :description => input[:description].try(:capitalize) || input[:job_category] }
      end

      def humanized_name
        N_('Remote action:')
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Fail
      end

      def humanized_output
        continuous_output.humanize
      end

      def continuous_output_providers
        super << self
      end

      def fill_continuous_output(continuous_output)
        delegated_output.fetch('result', []).each do |raw_output|
          continuous_output.add_raw_output(raw_output)
        end

        final_timestamp = (continuous_output.last_timestamp || task.ended_at).to_f + 1

        if task.state == 'stopped' && task.result == 'cancelled'
          continuous_output.add_output(_('Job cancelled by user'), 'debug', final_timestamp)
        else
          fill_planning_errors_to_continuous_output(continuous_output) unless exit_status
        end
        if exit_status
          continuous_output.add_output(_('Exit status: %s') % exit_status, 'stdout', final_timestamp)
        elsif run_step && run_step.error
          continuous_output.add_output(_('Job finished with error') + ": #{run_step.error.exception_class} - #{run_step.error.message}", 'debug', final_timestamp)
        end
      rescue => e
        continuous_output.add_exception(_('Error loading data from proxy'), e)
      end

      def exit_status
        delegated_output[:exit_status]
      end

      private

      def update_host_status
        host = Host.find(input[:host][:id])
        status = host.execution_status_object || host.build_execution_status_object
        status.status = exit_status.to_s == "0" ? HostStatus::ExecutionStatus::OK : HostStatus::ExecutionStatus::ERROR
        status.save!
      end

      def delegated_output
        if input[:delegated_action_id]
          super
        elsif phase?(Present)
          # for compatibility with old actions
          old_action = all_planned_actions.first
          if old_action
            old_action.output.fetch('proxy_output', {})
          else
            {}
          end
        end
      end

      def verify_permissions(host, template_invocation)
        raise _('User can not execute job on host %s') % host.name unless User.current.can?(:view_hosts, host)
        raise _('User can not execute this job template') unless User.current.can?(:view_job_templates, template_invocation.template)

        # we don't want to load all template_invocations to verify so we construct Authorizer object manually and set
        # the base collection to current template
        authorizer = Authorizer.new(User.current, :collection => [ template_invocation.id ])
        raise _('User can not execute this job template on %s') % host.name unless authorizer.can?(:create_template_invocations, template_invocation)

        true
      end

      def determine_proxy!(proxy_selector, provider, host)
        proxy = proxy_selector.determine_proxy(host, provider)
        if proxy == :not_available
          offline_proxies = proxy_selector.offline
          settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
          raise n_('The only applicable proxy %{proxy_names} is down',
                   'All %{count} applicable proxies are down. Tried %{proxy_names}',
                   offline_proxies.count) % settings
        elsif proxy == :not_defined
          settings = { :global_proxy => 'remote_execution_global_proxy',
                       :fallback_proxy => 'remote_execution_fallback_proxy' }

          raise _('Could not use any proxy. Consider configuring %{global_proxy}, ' +
                  '%{fallback_proxy} in settings') % settings
        end
        proxy
      end
    end
  end
end
