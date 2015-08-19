class HostStatus::ExecutionStatus < HostStatus::Status
  OK = 0
  ERROR = 1

  def relevant?
    execution_tasks.present?
  end

  def to_status(options = {})
    if last_stopped_task.nil? || last_stopped_task.result == 'success'
      OK
    else
      ERROR
    end
  end

  def to_global(options = {})
    if to_status(options) == ERROR
      return HostStatus::Global::ERROR
    else
      return HostStatus::Global::OK
    end
  end

  def self.status_name
    N_('Execution')
  end

  def to_label(options = {})
    case to_status(options)
      when OK
        execution_tasks.present? ? N_('Last execution succeeded') : N_('No execution finished yet')
      when ERROR
        N_('Last execution failed')
      else
        N_('Unknown execution status')
    end
  end

  private

  def last_stopped_task
    @last_stopped_task ||= execution_tasks.order(:started_at).where(:state => 'stopped').last
  end

  def execution_tasks
    ForemanTasks::Task::DynflowTask.for_action(Actions::RemoteExecution::RunHostJob).for_resource(host)
  end
end
