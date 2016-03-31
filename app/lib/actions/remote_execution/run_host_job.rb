module Actions
  module RemoteExecution
    class RunHostJob < Actions::EntryAction

      middleware.do_not_use Dynflow::Middleware::Common::Transaction
      include Actions::RemoteExecution::Helpers::LiveOutput

      def resource_locks
        :link
      end

      def plan(job_invocation, host, template_invocation, proxy, options = {})
        action_subject(host, :job_category => job_invocation.job_category, :description => job_invocation.description)

        template_invocation.host_id = host.id
        template_invocation.run_host_job_task_id = task.id
        template_invocation.save!

        link!(job_invocation)
        link!(template_invocation)

        verify_permissions(host, template_invocation)
        hostname = find_ip_or_hostname(host)

        raise _('Could not use any template used in the job invocation') if template_invocation.blank?

        if proxy.blank?
          offline_proxies = options.fetch(:offline_proxies, [])
          settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
          raise n_('The only applicable proxy %{proxy_names} is down',
                   'All %{count} applicable proxies are down. Tried %{proxy_names}',
                   offline_proxies.count) % settings unless offline_proxies.empty?

          settings = { :global_proxy   => 'remote_execution_global_proxy',
                       :fallback_proxy => 'remote_execution_fallback_proxy' }

          raise _('Could not use any proxy. Consider configuring %{global_proxy} ' +
                  'or %{fallback_proxy} in settings') % settings
        end

        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        script = renderer.render
        raise _('Failed rendering template: %s') % renderer.error_message unless script

        provider = template_invocation.template.provider
        plan_action(RunProxyCommand, proxy, hostname, script, provider.proxy_command_options(template_invocation, host))
        plan_self
      end

      def finalize(*args)
        host = Host.find(input[:host][:id])
        host.refresh_statuses
        host.refresh_global_status!
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

      def find_ip_or_hostname(host)
        %w(execution primary provision).each do |flag|
          interface = host.send(flag + '_interface')
          if interface && interface.ip.present?
            return interface.ip
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
