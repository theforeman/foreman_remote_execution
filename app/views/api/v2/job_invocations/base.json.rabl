object @job_invocation

attributes :id, :description, :job_name, :targeting_id

child :task do
  attributes :id, :state
end
