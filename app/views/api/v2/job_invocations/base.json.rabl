object @job_invocation

attributes :id, :description, :job_category, :targeting_id, :status, :start_at, :status_label, :ssh_user, :time_to_pickup

node do |invocation|
  pattern_template = invocation.pattern_template_invocations.first
  {
    :template_id => pattern_template&.template_id,
    :template_name => pattern_template&.template_name,
    :effective_user => pattern_template&.effective_user,
    :succeeded => invocation.progress_report[:success],
    :failed    => invocation.progress_report[:error],
    :pending   => invocation.progress_report[:pending],
    :cancelled => invocation.progress_report[:cancelled],
    :total     => invocation_count(invocation, :output_key => :total_count),
    :missing   => invocation.missing_hosts_count,
    :total_hosts => invocation.total_hosts_count,
  }
end

child :task => :dynflow_task do
  attributes :id, :state
end

if params.key?(:include_permissions)
  node :permissions do |invocation|
    authorizer = Authorizer.new(User.current)
    {
      "edit_job_templates" => authorizer.can?("edit_job_templates", invocation, false),
      "view_foreman_tasks" => authorizer.can?("view_foreman_tasks", invocation.task, false),
      "edit_recurring_logics" => authorizer.can?("edit_recurring_logics", invocation.recurring_logic, false),
    }
  end
end
