module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction

      def resource_locks
        :link
      end

      include ::Dynflow::Action::Cancellable

      def plan(job_invocation, host)
        action_subject(host, :job_name => job_invocation.job_name)

        template_invocation = find_template_invocation(job_invocation, host)
        hostname = find_ip_or_hostname(host)
        proxy = find_proxy(template_invocation, host)

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _("Failed rendering template: %s") % renderer.error_message unless script

        link!(job_invocation)
        link!(template_invocation)

        plan_action(RunProxyCommand, proxy, hostname, script)
      end

      def output
        planned_actions(RunProxyCommand).first.live_output
      end

      def humanized_output
        host_run_action = planned_actions(RunProxyCommand).first
        proxy_output = host_run_action && host_run_action.output[:proxy_output]
        return unless proxy_output
        output = []
        if proxy_output[:result]
          output << proxy_output[:result].map { |o| o[:output] }.join("")
        end
        output << "Exit status: #{host_run_action.exit_status}" if host_run_action.exit_status
        return output.join("\n")
      end

      def humanized_name
        _('Run %{job_name} on %{host}') % { :job_name => input[:job_name], :host => input[:host][:name] }
      end

      def find_template_invocation(job_invocation, host)
        providers = available_providers(job_invocation, host)
        providers.each do |provider|
          job_invocation.template_invocations.each do |template_invocation|
            if template_invocation.template.provider_type == provider
              return template_invocation
            end
          end
        end

        raise _("Could not use any template used in the job invocation")
      end

      def find_ip_or_hostname(host)
        host.interfaces.each do |interface|
          return interface.ip unless interface.ip.blank?
        end
        return host.name
      end

      def available_providers(job_invocation, host)
        # TODO: determine from the host and job_invocation details
        return ['Ssh']
      end

      def find_proxy(template_invocation, host)
        provider = template_invocation.template.provider_type.to_s
        all_host_proxies(host).each do |proxies|
          if proxy = proxies.joins(:features).where("features.name = ?", provider).first
            return proxy
          end
        end
        raise _("Could not use any proxy: assign a proxy with provider '%{provider}' to the host or set '%{global_proxy_setting}' in settings") %\
            { :provider => provider, :global_proxy_setting => 'remote_execution_global_proxy' }
      end

      def all_host_proxies(host)
        Enumerator.new do |e|
          host.interfaces.each do |interface|
            if interface.subnet
              e << ::SmartProxy.where(:id => interface.subnet.proxies.map(&:id))
            end
          end
          e << host.smart_proxies
          e << ::SmartProxy.authorized if Setting[:remote_execution_global_proxy]
        end
      end
    end
  end
end
