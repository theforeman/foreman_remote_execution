object @job_invocation

attributes :id, :description, :job_name, :targeting_id, :status, :status_label

child :task do
  attributes :id, :state
end
