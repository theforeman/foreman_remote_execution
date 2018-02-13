# frozen_string_literal:true

module JobInvocationsHelper
  def minicard(icon, number, text)
    content_tag(:div, :class => 'card-pf card-pf-accented
                card-pf-aggregate-status card-pf-aggregate-status-mini') do
      content_tag(:h2, :class => 'card-pf-title', :style => 'line-height: 1.1') do
        icon_text(icon, '', :kind => 'pficon') +
        content_tag(:span, number, :class =>'card-pf-aggregate-status-count') +
        text
      end
    end
  end

  def job_invocation_task_buttons(task)
    job_invocation = task.task_groups.find { |group| group.class == JobInvocationTaskGroup }.job_invocation
    buttons = []
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_('Rerun'), rerun_job_invocation_path(:id => job_invocation.id),
                         :class => 'btn btn-default',
                         :title => _('Rerun the job'))
    end
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_('Rerun failed'), rerun_job_invocation_path(:id => job_invocation.id, :failed_only => 1),
                         :class => 'btn btn-default',
                         :disabled => task.sub_tasks.none? { |sub_task| task_failed?(sub_task) },
                         :title => _('Rerun on failed hosts'))
    end
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task)
      buttons << link_to(_('Job Task'), foreman_tasks_task_path(task),
                         :class => 'btn btn-default',
                         :title => _('See the last task details'))
    end
    if authorized_for(:permission => :edit_foreman_tasks, :auth_object => task)
      buttons << link_to(_('Cancel Job'), cancel_foreman_tasks_task_path(task),
                         :class => 'btn btn-danger',
                         :title => _('Try to cancel the job'),
                         :disabled => !task.cancellable?,
                         :method => :post)
    end
    buttons
  end

  def job_invocations_buttons
    [
      documentation_button_rex('3.2ExecutingaJob'),
      display_link_if_authorized(_('Run Job'), hash_for_new_job_invocation_path)
    ]
  end

  def template_name_and_provider_link(template)
    template_name = content_tag(:strong, template.name)
    provider = template.provider.humanized_name
    link_content = template_name + ' - ' + provider + ' ' +
      icon_text('edit', '', :kind => 'pficon')
    link_to_if_authorized(link_content,
                          hash_for_edit_job_template_path(:id => template.id))
  end

  def preview_hosts(template_invocation)
    hosts = template_invocation.targeting.hosts.take(20)
    hosts.map do |host|
      collapsed_preview(host) +
        render(:partial => 'job_invocations/user_input',
               :locals => { :template_invocation => template_invocation,
                            :target => host })
    end.reduce(:+)
  end

  def collapsed_preview(target)
    title = target.try(:name) || 'N/A'
    content_tag(:h5,
                :class => "expander collapsed out",
                :data => { :toggle => 'collapse',
                           :target => "#preview_#{target.id}" }) do
      content_tag(:span, '', :class => 'caret') + title
    end
  end
end
