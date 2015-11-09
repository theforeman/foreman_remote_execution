module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy, connection_options = {})
        action_subject(host, :job_name => job_invocation.job_name)
        hostname = find_ip_or_hostname(host)

        raise _("Could not use any template used in the job invocation") if template_invocation.blank?

        settings =  { :global_proxy   => 'remote_execution_global_proxy',
                      :fallback_proxy => 'remote_execution_fallback_proxy' }

        raise _("Could not use any proxy. Consider configuring %{global_proxy} " +
                "or %{fallback_proxy} in settings") % settings if proxy.blank?

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _("Failed rendering template: %s") % renderer.error_message unless script

        link!(job_invocation)
        link!(template_invocation)

        provider = template_invocation.template.provider_type.to_s
        plan_action(RunProxyCommand, proxy, hostname, script, { :connection_options => connection_options }.merge(provider_settings(provider, host)))
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
        planned_actions(RunProxyCommand).first.live_output
      end

      def humanized_name
        _('Run %{job_name} on %{host}') % { :job_name => input[:job_name], :host => input[:host][:name] }
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

      def provider_settings(provider, host)
        case provider
        when 'Ssh'
          { :ssh_user => host.params['remote_execution_ssh_user'] || Setting[:remote_execution_ssh_user] }
        else
          {}
        end
      end
    end
  end
end
