module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction

      middleware.do_not_use Dynflow::Middleware::Common::Transaction

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
        hostname = find_ip_or_hostname(host)

        raise _('Could not use any template used in the job invocation') if template_invocation.blank?

        provider = template_invocation.template.provider_type.to_s
        proxy = proxy_selector.determine_proxy(host, provider)
        if proxy == :not_available
          offline_proxies = proxy_selector.offline
          settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
          raise n_('The only applicable proxy %{proxy_names} is down',
                   'All %{count} applicable proxies are down. Tried %{proxy_names}',
                   offline_proxies.count) % settings
        elsif proxy == :not_defined && !Setting['remote_execution_without_proxy']
          settings = { :global_proxy => 'remote_execution_global_proxy',
                       :fallback_proxy => 'remote_execution_fallback_proxy',
                       :no_proxy => 'remote_execution_no_proxy' }

          raise _('Could not use any proxy. Consider configuring %{global_proxy}, ' +
                  '%{fallback_proxy} or %{no_proxy} in settings') % settings
        end

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _('Failed rendering template: %s') % renderer.error_message unless script

        provider = template_invocation.template.provider
        action_options = provider.proxy_command_options(template_invocation, host).merge(:hostname => hostname, :script => script)
        plan_delegated_action(proxy, ForemanRemoteExecutionCore::Actions::RunScript, action_options)
        plan_self
      end

      def finalize(*args)
        check_exit_status
      end

      def check_exit_status
        if delegated_output[:exit_status].to_s != '0'
          error! _('Playbook execution failed')
        end
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

      def finalize
        if exit_status.to_s != '0'
          error! _('Playbook execution failed')
        end
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
        fill_planning_errors_to_continuous_output(continuous_output) unless exit_status
        delegated_output.fetch('result', []).each do |raw_output|
          continuous_output.add_raw_output(raw_output)
        end
        final_timestamp = (continuous_output.last_timestamp || task.ended_at).to_f + 1
        if exit_status
          continuous_output.add_output(_('Exit status: %s') % exit_status, 'stdout', final_timestamp)
        elsif run_step && run_step.error
          continuous_output.add_ouput(_('Job finished with error') + ": #{run_step.error.exception_class} - #{run_step.error.message}", 'debug', final_timestamp)
        end
      rescue => e
        continuous_output.add_exception(_('Error loading data from proxy'), e)
      end

      def exit_status
        delegated_output[:exit_status]
      end

      def find_ip_or_hostname(host)
        %w(execution primary provision).each do |flag|
          interface = host.send(flag + '_interface')
          return interface.ip if interface && interface.ip.present?
        end

        host.interfaces.each do |interface|
          return interface.ip unless interface.ip.blank?
        end

        return host.fqdn
      end

      private

      def delegated_output
        if input[:delegated_action_id]
          super
        elsif phase?(Present)
          # for compatibility with old actions
          if old_action = all_planned_actions.first
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
        raise _('User can not execute this job template on %s') % host.name unless authorizer.can?(:execute_template_invocation, template_invocation)

        true
      end
    end
  end
end
