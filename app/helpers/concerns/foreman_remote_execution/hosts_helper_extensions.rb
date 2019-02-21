module ForemanRemoteExecution
  module HostsHelperExtensions
    def multiple_actions
      super + [ [_('Schedule Remote Job'), new_job_invocation_path, false] ]
    end

    def schedule_job_multi_button(*args)
      host_features = RemoteExecutionFeature.with_host_action_button.order(:label).map do |feature|
        link_to(_('%s') % feature.name, job_invocations_path(:host_ids => [args.first.id], :feature => feature.label), :method => :post)
      end

      if host_features.present?
        action_buttons(schedule_job_button(*args), *host_features)
      else
        schedule_job_button(*args)
      end
    end

    def schedule_job_button(*args)
      link_to(_('Schedule Remote Job'), new_job_invocation_path(:host_ids => [args.first.id]), :id => :run_button, :class => 'btn btn-default')
    end

    def cockpit_url_for_host(host)
      tmpl = Setting[:remote_execution_cockpit_href]
      tmpl && tmpl != "" ? tmpl % { :host => host } : nil
    end

    def web_console_button(*args)
      url = cockpit_url_for_host(args.first.name)
      url ? link_to(_('Web Console'), url, :class => 'btn btn-default') : nil
    end

    def host_title_actions(*args)
      title_actions(button_group(schedule_job_multi_button(*args)),
                    button_group(web_console_button(*args)))
      super(*args)
    end
  end

end
