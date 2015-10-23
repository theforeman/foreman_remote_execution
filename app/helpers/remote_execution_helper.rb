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
      failed_tasks = bulk_task.sub_tasks.select { |sub_task| %w(warning error).include? sub_task.result }
      cancelled_tasks, failed_tasks = failed_tasks.partition { |task| task_cancelled? task }
      success = bulk_task.output['success_count'] || 0
      cancelled = cancelled_tasks.length
      failed = failed_tasks.length
      pending = (bulk_task.output['pending_count'] || bulk_task.sub_tasks.count)

      flot_pie_chart('status', job_invocation_status(invocation),
                     [{:label => _('Success'), :data => success, :color => '#5CB85C'},
                      {:label => _('Failed'), :data => failed, :color => '#D9534F'},
                      {:label => _('Pending'), :data => pending, :color => '#DEDEDE'},
                      {:label => _('Cancelled'), :data => cancelled, :color => '#B7312D'}],
                     options)
    else
      content_tag(:h4, job_invocation_status(invocation))
    end
  end

  def job_invocation_status(invocation)
    if invocation.last_task.blank?
      _('Job not started yet 0%')
    elsif invocation.last_task.state == 'scheduled'
      _('Job set to execute at %s') % invocation.last_task.start_at
    elsif invocation.last_task.state == 'stopped' && invocation.last_task.result == 'error'
      invocation.last_task.execution_plan.errors.map(&:message).join("\n")
    else
      label = invocation.last_task.pending ? _('Running') : _('Finished')
      label + ' ' + (invocation.last_task.progress * 100).to_i.to_s + '%'
    end
  end

  def task_cancelled?(task)
    task.execution_plan.errors.map(&:exception).any? { |exception| exception.class == ::ForemanTasks::Task::TaskCancelledException }
  end

  def host_counter(label, count)
    content_tag(:div, :class => 'host_counter') do
      content_tag(:div, label, :class => 'header') + content_tag(:div, count.to_s, :class => 'count')
    end
  end

  def template_invocation_status(task)
    if task.nil?
      content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-question-sign') + content_tag(:span, _('N/A'))
    else
      case task.result
        when 'warning', 'error'
          if task_cancelled?(task)
            content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-warning-sign') + content_tag(:span, _('cancelled'), :class => 'status-error')
          else
            content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-exclamation-sign') + content_tag(:span, _('failed'), :class => 'status-error')
          end
        when 'success'
          content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-ok-sign') + content_tag(:span, _('success'), :class => 'status-ok')
        when 'pending'
          content_tag(:i, '&nbsp'.html_safe, :class => 'glyphicon glyphicon-question-sign') + content_tag(:span, _('pending'))
        else
          task.result
      end
    end
  end

  def template_invocation_actions(task, host)
    if task.nil?
      []
    else
      [display_link_if_authorized(_("Details"), hash_for_template_invocation_path(:id => task).merge(:auth_object => host, :permission => :view_foreman_tasks))]
    end
  end

  def remote_execution_provider_for(task)
    template_invocation = task.locks.where(:resource_type => 'TemplateInvocation').first.try(:resource) unless task.nil?
    template_invocation.nil? ? _('N/A') : _(RemoteExecutionProvider.provider_for(template_invocation.template.provider_type))
  end

  def job_invocation_task_buttons(task)
    buttons = []
    buttons << link_to(_('Refresh'), {}, :class => 'btn btn-default', :title => _('Refresh this page'))
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_("Rerun"), rerun_job_invocation_path(:id => task.locks.where(:resource_type => 'JobInvocation').first.resource),
                         :class => "btn btn-default",
                         :title => _('Rerun the job'))
    end
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_("Rerun failed"), rerun_job_invocation_path(:id => task.locks.where(:resource_type => 'JobInvocation').first.resource, :failed_only => 1),
                         :class => "btn btn-default",
                         :title => _('Rerun on failed hosts'))
    end
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
    return buttons
  end

  def template_invocation_task_buttons(task)
    buttons = []
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task)
      buttons << link_to(_("Task Details"), foreman_tasks_task_path(task),
                         :class => "btn btn-default",
                         :title => _('See the task details'))
    end
    if authorized_for(:permission => :edit_foreman_tasks, :auth_object => task)
      buttons << link_to(_("Cancel Job"), cancel_foreman_tasks_task_path(task),
                         :class => "btn btn-danger",
                         :title => _('Try to cancel the job on a host'),
                         :disabled => !task.cancellable?,
                         :method => :post)
    end
    return buttons
  end

  def link_to_invocation_task_if_authorized(invocation)
    if invocation.last_task.present? && invocation.last_task.state != 'scheduled'
      link_to_if_authorized job_invocation_status(invocation),
                            hash_for_foreman_tasks_task_path(invocation.last_task).merge(:auth_object => invocation.last_task, :permission => :view_foreman_tasks)
    else
      job_invocation_status(invocation)
    end
  end

  def invocation_count(invocation, options = {})
    options = { :unknown_string => 'N/A' }.merge(options)
    if invocation.last_task.nil? || invocation.last_task.state != 'scheduled'
      (invocation.last_task.try(:output) || {}).fetch(options[:output_key], options[:unknown_string])
    else
      options[:unknown_string]
    end
  end

  def preview_box(template_invocation, target)
    renderer = InputTemplateRenderer.new(template_invocation.template, target, template_invocation)
    if (preview = renderer.preview)
      content_tag :pre, preview
    else
      alert :class => "alert-block alert-danger base in fade has-error",
            :text => renderer.error_message.html_safe
    end
  end
end
