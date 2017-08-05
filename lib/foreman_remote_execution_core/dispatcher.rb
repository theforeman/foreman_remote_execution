require 'foreman_tasks_core/runner/dispatcher'

module ForemanRemoteExecutionCore
  class Dispatcher < ::ForemanTasksCore::Runner::Dispatcher

    def refresh_interval
      # For the regular runner we don't want to let the user configure
      #   the refresh interval so live output keeps working
      @refresh_interval ||= if ForemanRemoteExecutionCore.settings[:async_ssh]
                              ForemanRemoteExecutionCore.settings[:runner_refresh_interval].to_i
                            else
                              1
                            end
    end

  end
end
