module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction
      include ::Actions::ObservableAction
      include ::Actions::RemoteExecution::TemplateInvocationProgressLogging

      execution_plan_hooks.use :emit_feature_event, :on => :success
      execution_plan_hooks.use :emit_feature_event_failure, :on => :failure

      middleware.do_not_use Dynflow::Middleware::Common::Transaction
      middleware.use Actions::Middleware::HideSecrets

      def queue
        ForemanRemoteExecution::DYNFLOW_QUEUE
      end

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy_selector = ::RemoteExecutionProxySelector.new, options = {})
        with_template_invocation_error_logging do
          inner_plan(job_invocation, host, template_invocation, proxy_selector, options)
        end
      end

      def inner_plan(job_invocation, host, template_invocation, proxy_selector, options)
        raise _('Could not use any template used in the job invocation') if template_invocation.blank?
        features = template_invocation.template.remote_execution_features.pluck(:label).uniq
        action_subject(host,
          :job_category => job_invocation.job_category,
          :description => job_invocation.description,
          :job_invocation_id => job_invocation.id,
          :job_features => features)

        template_invocation.host_id = host.id
        template_invocation.run_host_job_task_id = task.id
        template_invocation.save!

        link!(job_invocation)
        link!(template_invocation)

        verify_permissions(host, template_invocation)

        provider = template_invocation.template.provider
        proxy_selector = provider.required_proxy_selector_for(template_invocation.template) || proxy_selector

        provider_type = provider.proxy_feature
        proxy = determine_proxy!(proxy_selector, provider_type, host)
        link!(proxy)
        input[:proxy_id] = proxy.id

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _('Failed rendering template: %s') % renderer.error_message unless script

        first_execution = host.executed_through_proxies.where(:id => proxy.id).none?
        host.executed_through_proxies << proxy if first_execution

        additional_options = { :hostname => provider.find_ip_or_hostname(host),
                               :script => script,
                               :execution_timeout_interval => job_invocation.execution_timeout_interval,
                               :secrets => secrets(host, job_invocation, provider),
                               :use_batch_triggering => true,
                               :use_concurrency_control => options[:use_concurrency_control],
                               :first_execution => first_execution,
                               :alternative_names => provider.alternative_names(host) }
        action_options = provider.proxy_command_options(template_invocation, host)
                                 .merge(additional_options)

        plan_delegated_action(proxy, provider.proxy_action_class, action_options, proxy_action_class: ::Actions::RemoteExecution::ProxyAction)
        plan_self :with_event_logging => true
      end

      def finalize(*args)
        with_template_invocation_error_logging do
          update_host_status
          check_exit_status
        end
      end

      def self.feature_job_event_name(label, suffix = :success)
        ::Foreman::Observable.event_name_for("#{::Actions::RemoteExecution::RunHostJob.event_name_base}_#{label}_#{::Actions::RemoteExecution::RunHostJob.event_name_suffix(suffix)}")
      end

      def emit_feature_event_failure(execution_plan, hook = :failure)
        emit_feature_event(execution_plan, :failure)
      end

      def emit_feature_event(execution_plan, hook = :success)
        return unless root_action?

        payload = event_payload(execution_plan)
        if hook == :failure
          name = "#{self.class.event_name_base}_#{self.class.event_name_suffix(hook)}"
          trigger_hook name, payload: payload
        elsif input["job_features"]&.any?
          input['job_features'].each do |feature|
            name = "#{self.class.event_name_base}_#{feature}_#{self.class.event_name_suffix(hook)}"
            trigger_hook name, payload: payload
          end
        end
      end

      def secrets(host, job_invocation, provider)
        job_secrets = { :ssh_password => job_invocation.password,
                        :key_passphrase => job_invocation.key_passphrase,
                        :effective_user_password => job_invocation.effective_user_password }

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
        if input[:with_event_logging]
          continuous_output_from_template_invocation_events(continuous_output)
          return
        end

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
        elsif run_step&.error
          continuous_output.add_output(_('Job finished with error') + ": #{run_step.error.exception_class} - #{run_step.error.message}", 'debug', final_timestamp)
        end
      rescue => e
        continuous_output.add_exception(_('Error loading data from proxy'), e)
      end

      def continuous_output_from_template_invocation_events(continuous_output)
        begin
          # Trigger reload
          delegated_output unless task.state == 'stopped'
        rescue => e
          # This is enough, the error will get shown using add_exception at the end of the method
        end

        task.template_invocation.template_invocation_events.order(:sequence_id).find_each do |output|
          if output.event_type == 'exit'
            continuous_output.add_output(_('Exit status: %s') % output.event, 'stdout', output.timestamp)
          else
            continuous_output.add_raw_output(output.as_raw_continuous_output)
          end
        end
        continuous_output.add_exception(_('Error loading data from proxy'), e) if e
      end

      def exit_status
        input[:with_event_logging] ? task.template_invocation.template_invocation_events.find_by(event_type: 'exit').event : delegated_output[:exit_status]
      end

      def host_id
        input['host']['id']
      end

      def host_name
        input['host']['name']
      end

      def job_invocation_id
        input['job_invocation_id']
      end

      def job_invocation
        @job_invocation ||= ::JobInvocation.authorized.find(job_invocation_id)
      end

      def host
        @host ||= ::Host.authorized.find(host_id)
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
        infra_facet = host.infrastructure_facet
        if (infra_facet&.foreman_instance || infra_facet&.smart_proxy_id) && !User.current.can?(:execute_jobs_on_infrastructure_hosts)
          raise _('User can not execute job on infrastructure host %s') % host.name
        end

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
          settings = {
            global_proxy: 'remote_execution_global_proxy',
            fallback_proxy: 'remote_execution_fallback_proxy',
            provider: provider,
          }

          raise _('Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, ' +
                  '%{fallback_proxy} in settings') % settings
        end
        proxy
      end

      extend ApipieDSL::Class
      apipie :class, "An action representing execution of a job against a host" do
        name 'Actions::RemoteExecution::RunHostJob'
        refs 'Actions::RemoteExecution::RunHostJob'
        sections only: %w[all webhooks]
        property :task, object_of: 'Task', desc: 'Returns the task to which this action belongs'
        property :host_name, String, desc: "Returns the name of the host"
        property :host_id, Integer, desc: "Returns the id of the host"
        property :host, object_of: 'Host', desc: "Returns the host"
        property :job_invocation_id, Integer, desc: "Returns the id of the job invocation"
        property :job_invocation, object_of: 'JobInvocation', desc: "Returns the job invocation"
      end
      class Jail < ::Actions::ObservableAction::Jail
        allow :host_name, :host_id, :host, :job_invocation_id, :job_invocation
      end
    end
  end
end
