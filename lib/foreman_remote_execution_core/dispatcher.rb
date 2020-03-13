require 'foreman_tasks_core/runner/dispatcher'

module ForemanRemoteExecutionCore
  class Dispatcher < ::ForemanTasksCore::Runner::Dispatcher
    def refresh_interval
      @refresh_interval ||= ForemanRemoteExecutionCore.settings[:runner_refresh_interval] ||
                              ForemanRemoteExecutionCore.runner_class::DEFAULT_REFRESH_INTERVAL
    end
  end
end
