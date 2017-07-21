require 'foreman_tasks_core/runner/dispatcher'

module ForemanRemoteExecutionCore
  class Dispatcher < ::ForemanTasksCore::Runner::Dispatcher

    def refresh_interval
      @refresh_interval ||= ForemanRemoteExecutionCore.settings[:runner_refresh_interval].to_i
    end

  end
end
