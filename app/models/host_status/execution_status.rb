class HostStatus::ExecutionStatus < HostStatus::Status
  # execution finished successfully
  OK = 0
  # execution finished with error
  ERROR = 1
  # execution hasn't started yet, either scheduled to future or executor didn't create task yet
  QUEUED = 2
  # execution is in progress, dynflow task was created
  RUNNING = 3
  # mapping to string representation
  STATUS_NAMES = { OK => 'succeeded', ERROR => 'failed', QUEUED => 'queued', RUNNING => 'running' }

  def relevant?
    execution_tasks.present?
  end

  def to_status(options = {})
    ExecutionTaskStatusMapper.new(last_stopped_task).status
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

  class ExecutionTaskStatusMapper
    attr_accessor :task

    def self.sql_conditions_for(status)
      status = STATUS_NAMES.key(status) if status.is_a?(String)

      case status
        when OK
          [ "state = 'stopped' AND result = 'success'" ]
        when ERROR
          [ "state = 'stopped' AND (result = 'error' OR result = 'warning')" ]
        when QUEUED
          [ "state = 'scheduled' OR state IS NULL" ]
        when RUNNING
          [ "state <> 'stopped'" ]
        else
          [ '1 = 0' ]
      end
    end

    def initialize(task)
      self.task = task
    end

    def status
      if task.nil? || task.state == 'scheduled'
        QUEUED
      elsif task.state == 'stopped' && 'success' == task.result
        OK
      elsif task.pending?
        RUNNING
      else
        ERROR
      end
    end

    def status_label
      STATUS_NAMES[status]
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
