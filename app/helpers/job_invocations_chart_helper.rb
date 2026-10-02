# frozen_string_literal:true

module JobInvocationsChartHelper
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
end
