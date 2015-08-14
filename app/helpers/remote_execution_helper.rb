module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.map { |key, provider| [ key, _(provider) ] }
  end

  def template_input_types_options
    TemplateInput::TYPES.map { |key, name| [ _(name), key ] }
  end

  def job_invocation_chart(invocation)
    options = { :class => 'statistics-pie small', :expandable => true, :border => 0, :show_title => true }

    if (bulk_task = invocation.last_task)
      success = bulk_task.output['success_count'] || 0
      failed = bulk_task.output['failed_count'] || 0
      pending = (bulk_task.output['pending_count'] || 0)

      flot_pie_chart('status', job_invocation_status(invocation),
                     [{:label => _('Success'), :data => success, :color => '#5CB85C'},
                      {:label => _('Failed'), :data => failed, :color => '#D9534F'},
                      {:label => _('Pending'), :data => pending, :color => '#DEDEDE'}],
                     options)
    else
      content_tag(:h4, job_invocation_status(invocation))
    end
  end

  def job_invocation_status(invocation)
    if invocation.last_task.blank?
      _('Job not started yet 0%')
    else
      label = invocation.last_task.pending ? _('Running') : _('Finished')
      label + ' ' + (invocation.last_task.progress * 100).to_i.to_s + '%'
    end

  end

  def host_counter(label, count)
    content_tag(:div, :class => 'host_counter') do
      content_tag(:div, label, :class => 'header') + content_tag(:div, count.to_s, :class => 'count')
    end
  end

  def template_invocation_status(task)
    case task.result
      when 'warning', 'error'
        content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-exclamation-sign') + content_tag(:span, _('failed'), :class => 'status-error')
      when 'success'
        content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-ok-sign') + content_tag(:span, _('success'), :class => 'status-ok')
      else
        task.result
    end
  end

  def job_invocation_task_buttons(task)
    buttons = []
    buttons << link_to(_('Refresh'), {}, :class => 'btn btn-default', :title => _('Refresh this page'))
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task)
      buttons << link_to(_("Last Job Task"), foreman_tasks_task_path(task),
                         :class => "btn btn-default",
                         :title => _('See the last task details'))
    end
    if authorized_for(:permission => :edit_foreman_tasks, :auth_object => task)
      buttons << link_to(_("Cancel Job"), cancel_foreman_tasks_task_path(task),
                         :class => "btn btn-danger",
                         :title => _('Try to cancel the job'),
                         :disabled => !task.cancellable?,
                         :method => :post)
    end
    return button_group(*buttons)
  end

  def link_to_invocation_task_if_authorized(invocation)
    if invocation.last_task.present?
      link_to_if_authorized job_invocation_status(invocation),
                            hash_for_foreman_tasks_task_path(invocation.last_task).merge(:auth_object => invocation.last_task, :permission => :view_foreman_tasks)
    else
      job_invocation_status(invocation)
    end
  end

  def invocation_count(invocation, options = {})
    options = { :unknown_string => 'N/A' }.merge(options)
    (invocation.last_task.try(:output) || {}).fetch(options[:output_key], options[:unknown_string])
  end
end
