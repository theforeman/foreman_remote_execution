module JobInvocationsChartHelper
  def job_invocation_chart(invocation)
    donut_chart('#status_chart',
                job_invocation_data(invocation)[:columns],
                job_invocation_data(invocation)[:groups])
  end

  def job_invocation_data(invocation)
    success = job_invocation_success_count(invocation)
    cancelled = job_invocation_cancelled_count(invocation)
    failed = job_invocation_failed_count(invocation)
    pending = job_invocation_pending_count(invocation)
    columns = [[_('Success'), success, '#5CB85C'],
               [_('Failed'), failed, '#D9534F'],
               [_('Pending'), pending, '#DEDEDE'],
               [_('Cancelled'), cancelled, '#B7312D']]
    groups = [columns.map(&:first)]

    { :columns => columns, :groups => groups}
  end

  def job_invocation_status(invocation)
    case invocation.status
    when HostStatus::ExecutionStatus::QUEUED
      _('queued')
    when HostStatus::ExecutionStatus::RUNNING
      _('running %s%') % invocation.progress
    when HostStatus::ExecutionStatus::OK
      _('succeeded')
    when HostStatus::ExecutionStatus::ERROR
      _('failed')
    else
      _('unknown status')
    end
  end

  def job_invocation_success_status
    icon_text('ok',
              job_invocation_success_count(@job_invocation).to_s,
              :kind => 'pficon')
  end

  def job_invocation_failed_status
    icon_text('error-circle-o',
              job_invocation_failed_count(@job_invocation).to_s,
              :kind => 'pficon')
  end

  def job_invocation_pending_status
    icon_text('running',
              job_invocation_pending_count(@job_invocation).to_s,
              :kind => 'pficon')
  end

  def job_invocation_cancelled_status
    icon_text('close',
              job_invocation_cancelled_count(@job_invocation).to_s,
              :kind => 'pficon')
  end

  def job_invocation_failed_count(job_invocation)
    job_invocation.task.sub_tasks
                  .select { |sub_task| task_failed? sub_task }.length
  end

  def job_invocation_cancelled_count(job_invocation)
    job_invocation.task.sub_tasks
                  .select { |sub_task| task_cancelled? sub_task }.length
  end

  def job_invocation_success_count(job_invocation)
    job_invocation.task.output['success_count'] || 0
  end

  def job_invocation_pending_count(job_invocation)
    job_invocation.task.output['pending_count'] ||
      job_invocation.task.sub_tasks.count
  end

  def task_failed?(task)
    %w(warning error).include? task.result
  end

  def task_cancelled?(task)
    task.execution_plan.errors.map(&:exception).any? { |exception| exception.class == ::ForemanTasks::Task::TaskCancelledException }
  end
end
