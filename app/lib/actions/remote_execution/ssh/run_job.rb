module Actions
  module RemoteExecution
    module SSH
      class RunJob < RunHostJob
        def plan(job_invocation, host, template_invocation, proxy)
          super(job_invocation, host, template_invocation, proxy)

          hostname = find_ip_or_hostname(host)
          provider = template_invocation.template.provider
          plan_action(RunProxyCommand,
                      proxy,
                      hostname,
                      script(template_invocation, host),
                      provider.proxy_command_options(template_invocation, host))
        end

        def find_ip_or_hostname(host)
          %w(execution primary provision).each do |flag|
            if host.send("#{flag}_interface") && host.send("#{flag}_interface").ip.present?
              return host.send("#{flag}_interface").ip
            end
          end

          host.interfaces.each do |interface|
            return interface.ip unless interface.ip.blank?
          end

          host.fqdn
        end

        def script(template_invocation, host)
          renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
          renderer.render || _('Failed rendering template: %s') % renderer.error_message
        end
      end
    end
  end
end
