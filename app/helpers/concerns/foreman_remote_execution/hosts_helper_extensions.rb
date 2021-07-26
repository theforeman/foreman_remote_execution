module ForemanRemoteExecution
  module HostsHelperExtensions
    def host_overview_buttons(host)
      [
        { :button => link_to_if_authorized(_("Jobs"), hash_for_job_invocations_path(search: "host=#{host.name}"), :title => _("Job invocations"), :class => 'btn btn-default'), :priority => 200 },
      ]
    end

    def multiple_actions
      res = super
      res += [ [_('Schedule Remote Job'), new_job_invocation_path, false] ] if authorized_for(controller: :job_invocations, action: :new)
      res
    end

    def schedule_job_multi_button(*args)
      host_features = rex_host_features(*args)

      if host_features.present?
        action_buttons(schedule_job_button(*args), *host_features)
      else
        schedule_job_button(*args)
      end
    end

    def rex_host_features(*args)
      return unless authorized_for(controller: :job_invocations, action: :create)
      RemoteExecutionFeature.with_host_action_button.order(:label).map do |feature|
        link_to(_('%s') % feature.name, job_invocations_path(:host_ids => [args.first.id], :feature => feature.label), :method => :post)
      end
    end

    def schedule_job_button(*args)
      return unless authorized_for(controller: :job_invocations, action: :new)
      link_to(_('Schedule Remote Job'), new_job_invocation_path(:host_ids => [args.first.id]), :id => :run_button, :class => 'btn btn-default')
    end

    def web_console_button(host, *args)
      return unless authorized_for(permission: 'cockpit_hosts', auth_object: host)

      url = SSHExecutionProvider.cockpit_url_for_host(host.name)
      url ? link_to(_('Web Console'), url, :class => 'btn btn-default', :id => :'web-console-button', :target => '_new') : nil
    end

    def host_title_actions(*args)
      title_actions(button_group(schedule_job_multi_button(*args)),
        button_group(web_console_button(*args)))
      super(*args)
    end
  end

end
