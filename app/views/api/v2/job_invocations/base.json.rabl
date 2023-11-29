object @job_invocation

attributes :id, :description, :job_category, :targeting_id, :status, :start_at, :status_label, :ssh_user, :time_to_pickup

node do |invocation|
  pattern_template = invocation.pattern_template_invocations.first
  {
    :template_id => pattern_template&.template_id,
    :template_name => pattern_template&.template_name,
    :effective_user => pattern_template&.effective_user,
    :succeeded => invocation_count(invocation, :output_key => :success_count),
    :failed    => invocation_count(invocation, :output_key => :failed_count),
    :pending   => invocation_count(invocation, :output_key => :pending_count),
    :total     => invocation_count(invocation, :output_key => :total_count),
    :missing   => invocation.missing_hosts_count,
  }
end

child :task => :dynflow_task do
  attributes :id, :state
end

if params.key?(:include_permissions)
  node :permissions do |invocation|
    authorizer = Authorizer.new(User.current)
    edit_job_templates_permission = Permission.where(name: "edit_job_templates", resource_type: "JobTemplate").first
    {
      "edit_job_templates" => (edit_job_templates_permission && authorizer.can?("edit_job_templates", invocation, false)),
    }
  end
end
