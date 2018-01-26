# frozen_string_literal:true

module JobInvocationsChartHelper
  def job_invocation_chart(invocation)
    donut_chart('#status_chart',
      job_invocation_data(invocation)[:columns],
      job_invocation_data(invocation)[:groups])
  end

  def job_invocation_data(invocation)
    return @job_invocation_data if @job_invocation_data.present?

    progress_report = invocation.progress_report
    success = progress_report[:success]
    cancelled = progress_report[:cancelled]
    failed = progress_report[:error]
    pending = progress_report[:pending]
    columns = [[_('Success'), success, '#5CB85C'],
               [_('Failed'), failed, '#D9534F'],
               [_('Pending'), pending, '#DEDEDE'],
               [_('Cancelled'), cancelled, '#B7312D']]
    groups = [columns.map(&:first)]

    @job_invocation_data = { :columns => columns, :groups => groups}
  end

  def job_invocation_status(invocation, percent = nil, verbose = true)
    case invocation.status
    when HostStatus::ExecutionStatus::QUEUED
      if verbose && invocation.task
        _('queued to start executing in %{time}') % {:time => time_ago_in_words(invocation.task.start_at) }
      else
        _('queued')
      end
    when HostStatus::ExecutionStatus::RUNNING
      percent ||= invocation.progress_report[:progress]
      _('running %{percent}%%') % {:percent => percent}
    when HostStatus::ExecutionStatus::OK
      _('succeeded')
    when HostStatus::ExecutionStatus::CANCELLED
      _('cancelled')
    when HostStatus::ExecutionStatus::ERROR
      _('failed')
    else
      _('unknown status')
    end
  end

  def job_invocation_success_status
    icon_text('ok',
      @job_invocation_data[0][1],
      :kind => 'pficon')
  end

  def job_invocation_failed_status
    icon_text('error-circle-o',
      @job_invocation_data[1][1],
      :kind => 'pficon')
  end

  def job_invocation_pending_status
    icon_text('running',
      @job_invocation_data[2][1],
      :kind => 'pficon')
  end

  def job_invocation_cancelled_status
    icon_text('close',
      @job_invocation_data[3][1],
      :kind => 'pficon')
  end

  def task_failed?(task)
    %w(warning error).include? task.result
  end

  def task_cancelled?(task)
    task.execution_plan.errors.map(&:exception).any? { |exception| exception.class == ::ForemanTasks::Task::TaskCancelledException }
  end
end
