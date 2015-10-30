module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction

      middleware.do_not_use Dynflow::Middleware::Common::Transaction
      include Actions::RemoteExecution::Helpers::LiveOutput

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy)
        action_subject(host, :job_name => job_invocation.job_name, :description => job_invocation.description)

        template_invocation.update_attribute :host_id, host.id
        link!(job_invocation)
        link!(template_invocation)

        verify_permissions(host, template_invocation)
        hostname = find_ip_or_hostname(host)

        raise _("Could not use any template used in the job invocation") if template_invocation.blank?

        settings = { :global_proxy   => 'remote_execution_global_proxy',
                     :fallback_proxy => 'remote_execution_fallback_proxy' }

        raise _("Could not use any proxy. Consider configuring %{global_proxy} " +
                "or %{fallback_proxy} in settings") % settings if proxy.blank?

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _("Failed rendering template: %s") % renderer.error_message unless script

        provider = template_invocation.template.provider
        plan_action(RunProxyCommand, proxy, hostname, script, provider.proxy_command_options(template_invocation, host))
        plan_self
      end

      def finalize(*args)
        host = Host.find(input[:host][:id])
        host.refresh_statuses
      rescue => e
        Foreman::Logging.exception "Could not update execution status for #{input[:host][:name]}", e
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

      def humanized_name
        _('%{description} on %{host}') % { :job_name => input[:job_name],
                                           :host => input[:host][:name],
                                           :description => input[:description].try(:capitalize) || input[:job_name] }
      end

      def find_ip_or_hostname(host)
        %w(execution primary provision).each do |flag|
          if host.send("#{flag}_interface") && host.send("#{flag}_interface").ip.present?
            return host.execution_interface.ip
          end
        end

        host.interfaces.each do |interface|
          return interface.ip unless interface.ip.blank?
        end

        return host.fqdn
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
    end
  end
end
