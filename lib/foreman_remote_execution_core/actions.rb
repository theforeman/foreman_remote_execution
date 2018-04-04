require 'foreman_tasks_core/shareable_action'

module ForemanRemoteExecutionCore
  module Actions
    class RunScript < ForemanTasksCore::Runner::Action
      def initiate_runner
        additional_options = {
          :step_id => run_step_id,
          :uuid => execution_plan_id
        }
        ForemanRemoteExecutionCore.runner_class.build(input.merge(additional_options))
      end

      def runner_dispatcher
        ForemanRemoteExecutionCore::Dispatcher.instance
      end
    end
  end
end
