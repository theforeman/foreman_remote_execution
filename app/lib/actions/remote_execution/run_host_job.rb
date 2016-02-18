module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction
      middleware.do_not_use Dynflow::Middleware::Common::Transaction
      include Actions::RemoteExecution::Helpers::LiveOutput

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy)
        save_template_invocation(host, template_invocation)
        validate_template_invocation(template_invocation)
        validate_proxy(proxy)
        link!(job_invocation)
        link!(template_invocation)
        action_subject(host,
                       :job_category => job_invocation.job_category,
                       :description  => job_invocation.description)

        verify_permissions(host, template_invocation)
        plan_self
      end

      def finalize(*args)
        host = Host.find(input[:host][:id])
        host.refresh_statuses
      rescue => e
        ::Foreman::Logging.exception "Could not update execution status for #{input[:host][:name]}", e
      end

      def humanized_output
        live_output.map { |line| line['output'].chomp }.join("\n")
      end

      def live_output
        proxy_command_action = planned_actions(RunProxyCommand).first
        if proxy_command_action
          proxy_command_action.live_output
        else
          execution_plan.errors.map { |e| exception_to_output(_('Failed to initialize command'), e) }
        end
      end

      def humanized_input
        N_('%{description} on %{host}') % { :host => input[:host].try(:[], :name),
                                            :description => input[:description].try(:capitalize) || input[:job_category] }
      end

      def humanized_name
        N_('Remote action:')
      end

      private

      def verify_permissions(host, template_invocation)
        raise _('User can not execute job on host %s') % host.name unless User.current.can?(:view_hosts, host)
        raise _('User can not execute this job template') unless User.current.can?(:view_job_templates, template_invocation.template)

        # we don't want to load all template_invocations to verify so we construct Authorizer object manually and set
        # the base collection to current template
        authorizer = Authorizer.new(User.current, :collection => [ template_invocation.id ])
        raise _('User can not execute this job template on %s') % host.name unless authorizer.can?(:execute_template_invocation, template_invocation)

        true
      end

      def save_template_invocation(host, template_invocation)
        template_invocation.host_id = host.id
        template_invocation.run_host_job_task_id = task.id
        template_invocation.save!
      end

      def validate_template_invocation(template_invocation)
        raise _('Could not use any template used in the job invocation') if template_invocation.blank?
      end

      def validate_proxy(proxy)
        settings = { :global_proxy   => 'remote_execution_global_proxy',
                     :fallback_proxy => 'remote_execution_fallback_proxy' }
        raise _('Could not use any proxy. Consider configuring %{global_proxy} ' +
                'or %{fallback_proxy} in settings') % settings if proxy.blank?
      end
    end
  end
end
