class HostStatus::ExecutionStatus < HostStatus::Status
  # execution finished successfully
  OK = 0
  # execution finished with error
  ERROR = 1
  # execution hasn't started yet, either scheduled to future or executor didn't create task yet
  QUEUED = 2
  # execution is in progress, dynflow task was created
  RUNNING = 3
  # execution has been cancelled
  CANCELLED = 4
  # mapping to string representation
  STATUS_NAMES = { OK => 'succeeded', ERROR => 'failed', QUEUED => 'queued', RUNNING => 'running', CANCELLED => 'cancelled' }.freeze

  def relevant?(*args)
    execution_tasks.present?
  end

  def to_status(options = {})
    if self.new_record?
      ExecutionTaskStatusMapper.new(last_stopped_task).status
    else
      self.status
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
      when CANCELLED
        N_('Last execution cancelled')
      when ERROR
        N_('Last execution failed')
      else
        N_('Unknown execution status')
    end
  end

  def status_link
    job_invocation = last_stopped_task.parent_task.job_invocations.first
    return nil unless User.current.can?(:view_job_invocations, job_invocation)

    Rails.application.routes.url_helpers.job_invocation_path(job_invocation)
  end

  class ExecutionTaskStatusMapper
    attr_accessor :task

    def self.sql_conditions_for(status)
      status = STATUS_NAMES.key(status) if status.is_a?(String)

      case status
        when OK
          [ "foreman_tasks_tasks.state = 'stopped' AND foreman_tasks_tasks.result = 'success'" ]
        when CANCELLED
          [ "foreman_tasks_tasks.state = 'stopped' AND foreman_tasks_tasks.result = 'cancelled'" ]
        when ERROR
          [ "foreman_tasks_tasks.state = 'stopped' AND (foreman_tasks_tasks.result = 'error' OR foreman_tasks_tasks.result = 'warning')" ]
        when QUEUED
          [ "foreman_tasks_tasks.state = 'scheduled' OR foreman_tasks_tasks.state IS NULL" ]
        when RUNNING
          [ "foreman_tasks_tasks.state <> 'stopped'" ]
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
      elsif task.state == 'stopped' && task.result == 'success'
        OK
      elsif task.state == 'stopped' && task.result == 'cancelled'
        CANCELLED
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
