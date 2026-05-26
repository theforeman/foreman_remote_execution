object @job_invocation

extends 'api/v2/job_invocations/base'

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
  attributes :bookmark_id, :bookmark_name, :search_query, :targeting_type, :user_id, :status, :status_label,
    :randomized_ordering
end

child :task do
  attributes :id, :state, :started_at
end
