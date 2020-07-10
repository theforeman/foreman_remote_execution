module RemoteExecutionHelper
  # RemoteExecutionHelper.expects(:job_invocation_task_buttons).returns([])
  # doesn't work together with Leapp RemoteExecutionHelperExtension module
  def job_invocation_task_buttons(task)
    return []
  end
end
