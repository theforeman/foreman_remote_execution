object @job_invocation

extends "api/v2/job_invocations/base"

node do |invocation|
  if invocation.triggering
    case invocation.triggering.mode
    when :recurring
      {:mode => :recurring, :recurrence => partial('foreman_tasks/api/recurring_logics/base', :object => invocation.triggering.recurring_logic)}
    when :future
      {:mode => :future, :scheduling => {:start_at => invocation.triggering.start_at, :start_before => invocation.triggering.start_before }}
    end
  else
    {:mode => :immediate}
  end
end

child :targeting do
  attributes :bookmark_id, :search_query, :targeting_type, :user_id, :status, :status_label

  child :hosts do
    extends "api/v2/hosts/base"
  end
end

child :task do
  attributes :id, :state
end

child :template_invocations do
  attributes :template_id, :template_name
  child :input_values do
    attributes :template_input_name, :template_input_id, :value
  end
end
