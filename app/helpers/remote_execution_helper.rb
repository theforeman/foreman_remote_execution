module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.map { |key, provider| [ key, _(provider) ] }
  end

  def template_input_types_options
    TemplateInput::TYPES.map { |key, name| [ _(name), key ] }
  end

  def job_invocation_chart(invocation)
    options = { :class => 'statistics-pie small', :expandable => true, :border => 0, :show_title => true }

    if (bulk_task = invocation.task)
      failed_tasks = bulk_task.sub_tasks.select { |sub_task| task_failed? sub_task }
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
    case invocation.status
      when HostStatus::ExecutionStatus::QUEUED
        _('queued')
      when HostStatus::ExecutionStatus::RUNNING
        _('running %s%') % invocation.progress
      when HostStatus::ExecutionStatus::OK
        _('succeeded')
      when HostStatus::ExecutionStatus::ERROR
        _('failed')
      else
        _('unknown status')
    end
  end

  def task_failed?(task)
    %w(warning error).include? task.result
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

  def template_invocation_actions(task, host, job_invocation, template_invocation)
    [
      display_link_if_authorized(_('Host detail'), hash_for_host_path(host).merge(:auth_object => host, :permission => :view_hosts)),
      display_link_if_authorized(_('Rerun on %s') % host.name, hash_for_rerun_job_invocation_path(:id => job_invocation, :host_ids => [ host.id ])),
    ]
  end

  def remote_execution_provider_for(template_invocation)
    template_invocation.nil? ? _('N/A') : template_invocation.template.provider.humanized_name
  end

  def job_invocations_buttons
    [
      documentation_button_rex('3.2ExecutingaJob'),
      display_link_if_authorized(_('Run Job'), hash_for_new_job_invocation_path)
    ]
  end

  # rubocop:disable Metrics/AbcSize
  def job_invocation_task_buttons(task)
    job_invocation = task.task_groups.find { |group| group.class == JobInvocationTaskGroup }.job_invocation
    buttons = []
    buttons << link_to(_('Refresh'), {}, :class => 'btn btn-default', :title => _('Refresh this page'))
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_('Rerun'), rerun_job_invocation_path(:id => job_invocation.id),
                         :class => 'btn btn-default',
                         :title => _('Rerun the job'))
    end
    if authorized_for(hash_for_new_job_invocation_path)
      buttons << link_to(_('Rerun failed'), rerun_job_invocation_path(:id => job_invocation.id, :failed_only => 1),
                         :class => 'btn btn-default',
                         :disabled => !task.sub_tasks.any? { |sub_task| task_failed?(sub_task) },
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
    return buttons
  end
  # rubocop:enable Metrics/AbcSize

  def template_invocation_task_buttons(task)
    buttons = []
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task)
      buttons << link_to(_('Task Details'), foreman_tasks_task_path(task),
                         :class => 'btn btn-default',
                         :title => _('See the task details'))
    end
    if authorized_for(:permission => :edit_foreman_tasks, :auth_object => task)
      buttons << link_to(_('Cancel Job'), cancel_foreman_tasks_task_path(task),
                         :class => 'btn btn-danger',
                         :title => _('Try to cancel the job on a host'),
                         :disabled => !task.cancellable?,
                         :method => :post)
    end
    return buttons
  end

  def link_to_invocation_task_if_authorized(invocation)
    if invocation.queued?
      job_invocation_status(invocation)
    else
      link_to_if_authorized job_invocation_status(invocation),
                            hash_for_foreman_tasks_task_path(invocation.task).merge(:auth_object => invocation.task, :permission => :view_foreman_tasks)
    end
  end

  def invocation_count(invocation, options = {})
    options = { :unknown_string => 'N/A' }.merge(options)
    if invocation.queued?
      options[:unknown_string]
    else
      (invocation.task.try(:output) || {}).fetch(options[:output_key], options[:unknown_string])
    end
  end

  def preview_box(template_invocation, target)
    renderer = InputTemplateRenderer.new(template_invocation.template, target, template_invocation)
    if (preview = renderer.preview)
      content_tag :pre, preview
    else
      alert :class => 'alert-block alert-danger base in fade has-error',
            :text => renderer.error_message.html_safe
    end
  end

  def job_invocation_active_tab(tab, params)
    active = 'active'
    inactive = ''
    hosts_tab_active = params[:page].present? || params[:search].present? || params[:order].present?
    if hosts_tab_active
      tab == :hosts ? active : inactive
    else
      tab == :overview ? active : inactive
    end
  end

  def time_in_words_span(time)
    if time.nil?
      _('N/A')
    else
      content_tag :span, (time > Time.now ? _('in %s') : _('%s ago')) % time_ago_in_words(time),
                  { :'data-original-title' => time.try(:in_time_zone), :rel => 'twipsy' }
    end
  end

  def documentation_button_rex(section = '')
    url = 'http://theforeman.org/plugins/foreman_remote_execution/' +
      "#{ForemanRemoteExecution::VERSION.split('.').take(2).join('.')}/index.html#" +
      section
    link_to(
      icon_text('help', _('Documentation'),
                :class => 'icon-white', :kind => 'pficon'),
      url,
      :rel => 'external', :class => 'btn btn-info', :target => '_blank')
  end

  def template_input_header(f, template)
    header = _('Template input')
    header += ' ' + remove_child_link('x', f, {:rel => 'twipsy', :'data-title' => _('remove template input'), :'data-placement' => 'left',
                                               :class => 'fr badge badge-danger'}) unless template.locked?
    header.html_safe
  end

  def description_checkbox_f(f, job_template)
    check_box_tag('description_format_override',
                  job_template.generate_description_format,
                  f.object.description_format.nil?,
                  :name => f.object_name + '[description_override]',
                  :onchange => 'description_override(this);') + ' ' + _('Use default description template')
  end

  def description_format_textarea_f(f, job_template)
    textarea_f f, :description_format,
               :label => _('Description template'),
               :value => f.object.description_format || job_template.generate_description_format,
               :rows => 2,
               :onchange => 'regenerate_description(this);',
               :id => 'description_format',
               :help_inline => popover(_('Explanation'),
                                       _('This template is used to generate the description.
                                          Input values can be used using the syntax %{package}.
                                          You may also include the job category and template
                                          name using %{job_category} and %{template_name}.'))
  end
end
