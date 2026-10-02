module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.reject { |key, _provider| key == 'SSH' }.map { |key, provider| [ key, _(provider.humanized_name) ] }
  end

  def template_invocation_status(task, parent_task)
    return(parent_task.result == 'cancelled' ? 'cancelled' : 'N/A') if task.nil?
    return task.state if task.state == 'running' || task.state == 'planned'
    return 'error' if task.result == 'warning'

    task.result
  end

  def job_invocations_buttons
    [
      documentation_button('Managing_Hosts', type: 'docs', chapter: 'executing-a-remote-job_managing-hosts'),
      authorized_for(controller: :job_invocations, action: :create) ? link_to(_('Run Job'), hash_for_new_job_invocation_path, {:class => "btn btn-primary"}) : '',
    ]
  end

  def template_invocation_task_buttons(task, invocation)
    buttons = []
    if authorized_for(:permission => :view_foreman_tasks, :auth_object => task)
      buttons << link_to(_('Task Details'), foreman_tasks_task_path(task),
        :class => 'btn btn-default',
        :title => _('See the task details'))
    end
    if authorized_for(:permission => :cancel_job_invocations, :auth_object => invocation)
      buttons << link_to(_('Cancel Job'), cancel_foreman_tasks_task_path(task),
        :class => 'btn btn-danger',
        :title => _('Try to cancel the job on a host'),
        :disabled => !task.cancellable?,
        :method => :post,
        :remote => true)
      buttons << link_to(_('Abort Job'), abort_foreman_tasks_task_path(task),
        :class => 'btn btn-danger',
        :title => _('Try to abort the job on a host without waiting for its result'),
        :disabled => !task.cancellable?,
        :method => :post,
        :remote => true)
    end
    buttons
  end

  def link_to_invocation_task_if_authorized(invocation)
    status = job_invocation_status(invocation, nil, false)
    if invocation.queued?
      status
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
    elsif options[:output_key] == :total_count
      invocation.total_hosts_count
    else
      (invocation.task.try(:output) || {}).fetch(options[:output_key], options[:unknown_string])
    end
  end

  def invocation_description(invocation, keep_tooltip: true)
    description = invocation.description.try(:capitalize) || invocation.job_category
    description = trunc_with_tooltip(description, 80) if keep_tooltip
    description
  end

  def invocation_result(invocation, key)
    unknown = '&mdash;'
    result = invocation_count(invocation, :output_key => key, :unknown_string => unknown.html_safe) # rubocop:disable Rails/OutputSafety
    label = key == :failed_count ? 'danger' : 'info'
    result == unknown ? result : report_event_column(result, "label-#{label}")
  end

  def preview_box(template_invocation, target)
    renderer = InputTemplateRenderer.new(template_invocation.template, target, template_invocation)
    if (preview = (load_template_from_task(template_invocation, target) || renderer.preview))
      content_tag :pre, preview
    elsif target.nil?
      alert :text => _('Could not render the preview because no host matches the search query.'),
        :class => 'alert alert-block alert-warning base',
        :close => false
    else
      alert :class => 'alert-block alert-danger base in fade has-error',
        :text => renderer.error_message.html_safe # rubocop:disable Rails/OutputSafety
    end
  end

  # we assume that a line_set will always end with a line break. Sometimes however, the lines can
  # be cut in the middle. This methods makes sure the cut line ends up in on line set
  def normalize_line_sets(line_sets)
    previous_line_break = true
    line_sets.each_with_index do |line_set, index|
      # if previous line_set was missing break, add the first line from next set
      unless previous_line_break
        first_line_pattern = /\A.*\n/
        first_line = line_set['output'][first_line_pattern]
        if first_line
          line_sets[index - 1]['output'] << first_line
          line_set['output'].sub!(first_line_pattern, '')
        end
      end
      previous_line_break = line_set['output'] =~ /\n\Z/
    end
    line_sets
  end

  def time_in_words_span(time)
    if time.nil?
      _('N/A')
    else
      content_tag :span, (time > Time.now.utc ? _('in %s') : _('%s ago')) % time_ago_in_words(time),
        { :'data-original-title' => time.try(:in_time_zone), :rel => 'twipsy' }
    end
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
        'name using %{job_category} and %{template_name}.').html_safe # rubocop:disable Rails/OutputSafety
  end

  def load_template_from_task(template_invocation, target)
    task = template_invocation.job_invocation.sub_task_for_host(target)
    return if [nil, 'scheduled', 'planning'].include?(task&.state)

    task.execution_plan.actions[1].try(:input).try(:[], 'script')
  end

  def job_report_template
    template = ReportTemplate.where(name: Setting['remote_execution_job_invocation_report_template']).first

    template if template && template.template_inputs.where(name: 'job_id').exists?
  end

  def job_report_template_parameters(job_invocation, template)
    template_input = template.template_inputs.where(name: 'job_id').first
    raise "#job_report_template_parameters need template that has 'job_id' input" unless template_input

    {
      report_template_report: {
        input_values: {
          "#{template_input.id}": {
            value: job_invocation.id,
          },
        },
      },
    }
  end
end
