object @job_invocation

attributes :id, :description, :job_category, :targeting_id, :status, :start_at, :status_label

node do |invocation|
  {
    :succeeded => invocation_count(invocation, :output_key => :success_count),
    :failed    => invocation_count(invocation, :output_key => :failed_count),
    :pending   => invocation_count(invocation, :output_key => :pending_count),
    :total     => invocation_count(invocation, :output_key => :total_count)
  }
end

child :task do
  attributes :id, :state
end
