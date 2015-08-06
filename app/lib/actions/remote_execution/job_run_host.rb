module Actions
  module RemoteExecution
    class JobRunHost < Actions::EntryAction

      include ::Dynflow::Action::Cancellable

      def plan(job_invocation, host)
        template_invocation = find_template_invocation_for_host(job_invocation, host)
        unless template_invocation
          raise _("Couldn't not use any template for host %{host_name} and job invocation %{job_invocation_id}") %\
              { :hostname => host.name, :job_invocation_id => job_invocation.id }
        end

        interface = available_interfaces(template_invocation, host).first
        unless interface
          raise _("Couldn't not use any interface for host %{host_name} and job invocation %{job_invocation_id} (provider %{provider_type})") %\
              { :hostname => host.name, :job_invocation_id => job_invocation.id, :provider_type => template_invocation.template.provider_type }
        end

        proxy = proxy_for_interface(interface)
        unless proxy
          raise _("Couldn't not use any proxy for host %{host_name} and job invocation %{job_invocation_id} (provider %{provider_type})") %\
              { :hostname => host.name, :job_invocation_id => job_invocation.id, :provider_type => template_invocation.template.provider_type }
        end

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)

        script = renderer.render

        action_subject(host, :job_name => job_invocation.job_name)

        hostname = interface.ip
        hostname = interface.name unless hostname.present?
        hostname = host.name unless hostname.present?

        plan_action(HostRun, proxy, hostname, script)
      end

      def humanized_output
        host_run_action = planned_actions(HostRun).first
        proxy_output = host_run_action && host_run_action.output[:proxy_output]
        return unless proxy_output
        if proxy_output[:result]
          proxy_output[:result].map { |o| o[:output] }.join("")
        end
      end

      def find_template_invocation_for_host(job_invocation, host)
        providers = available_providers(job_invocation, host)
        providers.each do |provider|
          job_invocation.template_invocations.each do |template_invocation|
            if template_invocation.template.provider_type == provider
              return template_invocation
            end
          end
        end
      end

      def available_providers(job_invocation, host)
        # TODO: determine from the host and job_invocation details
        return ['ssh']
      end

      def available_interfaces(template_invocation, host)
        # TODO: determine the nic interface to use for the connection,
        # based on the proxy settings
        host.interfaces
      end

      def proxy_for_interface(interface)
        # TODO: move to proxy as a concern and make proper calculation
        SmartProxy.all.find { |proxy| proxy.features.any? { |f| f.name.downcase == 'ssh' } }
      end
    end
  end
end
