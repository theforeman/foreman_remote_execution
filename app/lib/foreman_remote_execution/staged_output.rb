module ForemanRemoteExecution
  class Stage
    attr_reader :name, :resource
    attr_accessor :result

    def initialize(name, result, resource: nil)
      @name = name
      @result = result
      @resource = resource
    end
  end

  class StagedOutput
    def initialize(job_invocation, host, proxy)
      @job_invocation = job_invocation
      @host = host
      @proxy = proxy
    end

    def output
      foreman = Stage.new('Foreman', 'pending')
      proxy = Stage.new('Smart Proxy', 'pending', resource: @proxy)
      host = Stage.new('Remote Host', 'pending', resource: @host)

      sub_task = @job_invocation.sub_task_for_host(@host)
      remote_task = sub_task&.remote_tasks&.first

      case sub_task&.state
      when nil, 'pending'
        foreman.result = 'active'
      when 'running'
        case remote_task&.state
        when nil, 'new', 'external'
          foreman.result = 'active'
        when 'triggered', 'parent-triggered'
          foreman.result = proxy.result = 'done'
          host.result = 'active'
        else
          foreman.result = 'done'
          proxy.result = 'active'
        end
      when 'stopped'
        if sub_task.result == 'success'
          foreman.result = proxy.result = host.result = 'done'
        elsif sub_task.execution_plan.errors.any? { |error| error.exception_class == ::Actions::RemoteExecution::RunHostJob::ProxySelectionFailure }
          # Foreman failed to pick a proxy
          foreman.result = 'done'
          proxy.result = 'error'
        elsif sub_task.main_action.steps.compact.count == 1
          # The sub task has not reached its run phase
          foreman.result = 'error'
        elsif sub_task.main_action.exit_status == 'EXCEPTION'
          # It started running at the proxy, but an exception was raised there
          foreman.result = 'done'
          proxy.result = 'error'
        elsif sub_task.main_action.exit_status.is_a?(Integer)
          # A numeric exit status means it actually ran on the remote host
          foreman.result = proxy.result = 'done'
          host.result = 'error'
        end
      end

      [foreman, proxy, host]
    end
  end
end
