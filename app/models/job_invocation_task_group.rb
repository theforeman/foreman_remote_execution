class JobInvocationTaskGroup < ::ForemanTasks::TaskGroup

  has_one :job_invocation, :foreign_key => :task_group_id

  alias_method :resource, :job_invocation

  def resource_name
    N_('Job Invocation')
  end

  def self.search_query_for(thing)
    case thing
    when ::ForemanTasks::RecurringLogic
      "recurring_logic.id = #{thing.id}"
    end
  end

end
