object @job_invocation

attributes :id, :job_name, :targeting_id

child :task do
  attributes :id, :state
end
