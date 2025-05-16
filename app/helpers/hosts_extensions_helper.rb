module HostsExtensionsHelper
  def rex_hosts_multiple_actions
    return [] unless can_schedule_jobs?

    [{ action: [_('Schedule Remote Job'), new_job_invocation_path, false], priority: 1000 }]
  end

  def rex_host_overview_buttons(host)
    [
      { button: link_to_if_authorized(_("Jobs"), hash_for_job_invocations_path(search: "host=#{host.name}"), title: _("Job invocations"), class: 'btn btn-default'), priority: 200 },
    ]
  end

  def host_title_actions(*args)
    title_actions(button_group(schedule_job_multi_button(*args)),
      button_group(web_console_button(*args)))
    super(*args)
  end

  private

  def schedule_job_multi_button(*args)
    host_features = rex_host_features(*args)

    if host_features.present?
      action_buttons(schedule_job_button(*args), *host_features)
    else
      schedule_job_button(*args)
    end
  end

  def rex_host_features(host, *_rest)
    return [] unless can_execute_on_host?(host)
    RemoteExecutionFeature.with_host_action_button.order(:label).map do |feature|
      link_to(_('%s') % feature.name, job_invocations_path(:host_ids => [host.id], :feature => feature.label), :method => :post)
    end
  end

  def schedule_job_button(host, *_rest)
    return unless can_execute_on_host?(host)
    link_to(_('Schedule Remote Job'), new_job_invocation_path(:host_ids => [host.id]), :id => :run_button, :class => 'btn btn-default')
  end

  def web_console_button(host, *_args)
    return if !authorized_for(permission: 'cockpit_hosts', auth_object: host) || !can_execute_on_infrastructure_host?(host)

    url = ScriptExecutionProvider.cockpit_url_for_host(host.name)
    url ? link_to(_('Web Console'), url, :class => 'btn btn-default', :id => :'web-console-button', :target => '_new') : nil
  end

  def can_schedule_jobs?
    authorized_for(controller: :job_invocations, action: :create)
  end

  def can_execute_on_host?(host)
    can_schedule_jobs? && can_execute_on_infrastructure_host?(host)
  end

  def can_execute_on_infrastructure_host?(host)
    !host.infrastructure_host? || User.current.can?(:execute_jobs_on_infrastructure_hosts)
  end
end
