object @job_invocation

extends "api/v2/job_invocations/main"

child :targeting do
  attributes :bookmark_id, :search_query, :targeting_type, :user_id
end

child :task do
  attributes :id, :state
end

child :template_invocations do
  attributes :template_id
  child :input_values do
    attributes :template_input_id, :value
  end
end
