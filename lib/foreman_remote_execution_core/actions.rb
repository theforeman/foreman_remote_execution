require 'foreman_tasks_core/shareable_action'

module ForemanRemoteExecutionCore
  module Actions
    class RunScript < ForemanTasksCore::Runner::Action
      def initiate_runner
        ScriptRunner.new(input)
      end
    end
  end
end
