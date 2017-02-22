# rubocop:disable Metrics/ModuleLength
module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.map { |key, provider| [ key, _(provider.humanized_name) ] }
  end

  def template_input_types_options
    TemplateInput::TYPES.map { |key, name| [ _(name), key ] }
  end

  def job_invocation_chart(invocation)
    options = { :class => 'statistics-pie small', :expandable => true, :border => 0, :show_title => true }

    if (invocation.task)
      report = invocation.progress_report
      flot_pie_chart('status', job_invocation_status(invocation, report[:progress]),
                     [{:label => _('Success'),   :data => report[:success],   :color => '#5CB85C'},
                      {:label => _('Failed'),    :data => report[:failed],    :color => '#D9534F'},
                      {:label => _('Pending'),   :data => report[:pending],   :color => '#DEDEDE'},
                      {:label => _('Cancelled'), :data => report[:cancelled], :color => '#B7312D'}],
                     options)
    else
      content_tag(:h4, job_invocation_status(invocation))
    end
  end

  def job_hosts_authorizer
    @job_hosts_authorizer ||= Authorizer.new(User.current, :collection => @hosts)
  end

  def job_invocation_status(invocation, percent = invocation.percent)
    case invocation.status
      when HostStatus::ExecutionStatus::QUEUED
        _('queued')
      when HostStatus::ExecutionStatus::RUNNING
        _('running %{percent}%%') % {:percent => percent}
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

  def task_success?(task)
    task.result == 'success'
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
      icon_text('question', 'N/A', :kind => 'fa')
    elsif task.state == 'running'
      icon_text('running', _('running'), :kind => 'pficon')
    elsif task.state == 'planned'
      icon_text('build', _('planned'), :kind => 'pficon')
    else
      case task.result
        when 'warning', 'error'
          if task_cancelled?(task)
            icon_text('warning-triangle-o', _('cancelled'), :kind => 'pficon')
          else
            icon_text('error-circle-o', _('failed'), :kind => 'pficon')
          end
        when 'success'
          icon_text('ok', _('success'), :kind => 'pficon')
        else
          task.result
      end
    end
  end

  def template_invocation_actions(task, host, job_invocation, template_invocation)
    [
      display_link_if_authorized(_('Host detail'), hash_for_host_path(host).merge(:auth_object => host, :permission => :view_hosts, :authorizer => job_hosts_authorizer)),
      display_link_if_authorized(_('Rerun on %s') % host.name, hash_for_rerun_job_invocation_path(:id => job_invocation, :host_ids => [ host.id ], :authorizer => job_hosts_authorizer)),
    ]
  end

  def remote_execution_provider_for(template_invocation)
    template_invocation.nil? ? _('N/A') : template_invocation.template.provider.humanized_name
  end

  def job_invocations_buttons
    [
      documentation_button_rex('3.2ExecutingaJob'),
      new_link(_('Run Job'))
    ]
  end

  # rubocop:disable Metrics/AbcSize
  def job_invocation_task_buttons(task)
    job_invocation = task.task_groups.find { |group| group.class == JobInvocationTaskGroup }.job_invocation
    task_authorizer = Authorizer.new(User.current, :collection => [task])
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
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task, :authorizer => task_authorizer)
      buttons << link_to(_('Job Task'), foreman_tasks_task_path(task),
                         :class => 'btn btn-default',
                         :title => _('See the last task details'))
    end
    if authorized_for(:permission => :edit_foreman_tasks, :auth_object => task, :authorizer => task_authorizer)
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
      task_authorizer = Authorizer.new(User.current, :collection => [invocation.task])
      link_to_if_authorized job_invocation_status(invocation),
                            hash_for_foreman_tasks_task_path(invocation.task).merge(:auth_object => invocation.task, :permission => :view_foreman_tasks, :authorizer => task_authorizer)
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

  def invocation_description(invocation)
    description = invocation.description.try(:capitalize) || invocation.job_category
    trunc_with_tooltip(description, 80)
  end

  def invocation_result(invocation, key)
    unknown = '&mdash;'
    result = invocation_count(invocation, :output_key => key, :unknown_string => unknown.html_safe)
    label = key == :failed_count ? 'danger' : 'info'
    result == unknown ? result : report_event_column(result, "label-#{label}")
  end

  def preview_box(template_invocation, target)
    renderer = InputTemplateRenderer.new(template_invocation.template, target, template_invocation)
    if (preview = renderer.preview)
      content_tag :pre, preview
    else
      if target.nil?
        alert :text => _('Could not render the preview because no host matches the search query.'),
              :class => 'alert alert-block alert-warning base',
              :close => false
      else
        alert :class => 'alert-block alert-danger base in fade has-error',
              :text => renderer.error_message.html_safe
      end
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
      content_tag :span, (time > Time.now.utc ? _('in %s') : _('%s ago')) % time_ago_in_words(time),
                  { :'data-original-title' => time.try(:in_time_zone), :rel => 'twipsy' }
    end
  end

  def documentation_button_rex(section = '')
    url = 'http://theforeman.org/plugins/foreman_remote_execution/' +
      "#{ForemanRemoteExecution::VERSION.split('.').take(2).join('.')}/index.html#"
    documentation_button section, :root_url => url
  end

  def template_input_header(f, template)
    header = _('Template input')
    header += ' ' + remove_child_link('x', f, {:rel => 'twipsy', :'data-title' => _('remove template input'), :'data-placement' => 'left',
                                               :class => 'fr badge badge-danger'}) unless template.locked?
    header.html_safe
  end

  def description_checkbox_f(f, job_template, disabled)
    check_box_tag('description_format_override',
                  job_template.generate_description_format,
                  f.object.description_format.nil?,
                  :class => 'description_format_override',
                  :name => f.object_name + '[description_override]',
                  :disabled => disabled,
                  :onchange => 'description_override(this);') + ' ' + _('Use default description template')
  end

  def description_format_textarea_f(f, job_template, disabled)
    textarea_f f, 'description_format',
               :label => _('Description template'),
               :value => f.object.description_format || job_template.generate_description_format,
               :rows => 2,
               :onchange => 'regenerate_description(this);',
               :class => 'description_format advanced',
               :disabled => disabled,
               :label_help => description_format_help
  end

  def description_format_help
    _('This template is used to generate the description.<br/>' +
        'Input values can be used using the syntax %{package}.<br/>' +
        'You may also include the job category and template<br/>' +
        'name using %{job_category} and %{template_name}.').html_safe
  end

  def advanced_switch_f(default_text, switch_text)
    content_tag :div, :class => 'form-group' do
      content_tag(:div, '', :class => 'col-md-2 control-label') +
      content_tag(:div, :class => 'col-md-4') do
        content_tag(:i, '', :class => 'fa fa-angle-right') + ' ' +
        link_to(default_text, '#', :class => 'advanced_fields_switch', :'data-alternative-label' => switch_text)
      end
    end
  end
end
