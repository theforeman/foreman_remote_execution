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

  child @hosts => :hosts do
    extends 'api/v2/hosts/base'

    if params[:host_status] == 'true'
      node :job_status do |host|
        @host_statuses[host.id]
      end
    end
  end
end

child :task do
  attributes :id, :state, :started_at
end

child @template_invocations do
  attributes :template_id, :template_name, :host_id
  child :input_values do
    attributes :template_input_name, :template_input_id
    node :value do |iv|
      iv.template_input.respond_to?(:hidden_value) && iv.template_input.hidden_value? ? '*' * 5 : iv.value
    end
  end
end
