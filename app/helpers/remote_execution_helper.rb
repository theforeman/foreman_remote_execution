module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.map { |key, provider| [ key, _(provider) ] }
  end

  def template_input_types_options
    TemplateInput::TYPES.map { |key, name| [ _(name), key ] }
  end

  def job_invocation_chart(bulk_task)
    options = { :class => "statistics-pie small", :expandable => true, :border => 0, :show_title => true }

    success = bulk_task.output['success_count']
    failed = bulk_task.output['failed_count']
    pending = bulk_task.output['total_count'] - failed - success

    flot_pie_chart("status", job_invocation_status(@job_invocation) + ' ' + (@job_invocation.last_task.progress * 100).to_i.to_s + '%',
                   [{:label => _('Success'), :data => success, :color => '#5CB85C'},
                    {:label => _('Failed'), :data => failed, :color => '#D9534F'},
                    {:label => _('Pending'), :data => pending, :color => '#DEDEDE'}],
                   options)
  end

  def job_invocation_status(invocation)
    invocation.last_task.pending ? _('Running') : _('Finished')
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
end
