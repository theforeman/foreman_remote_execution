module Actions
  module Middleware

    class BindJobInvocation < ::Dynflow::Middleware

      def delay(*args)
        _schedule_options, job_invocation = args
        pass(*args).tap { bind(job_invocation) }
      end

      def plan(*args)
        job_invocation = args.first
        pass(*args).tap { bind(job_invocation) }
      end

      private

      def task
        @task ||= ForemanTasks::Task::DynflowTask.find_by_external_id!(action.execution_plan_id)
      end

      def bind(job_invocation)
        job_invocation.update_attribute :last_task_id, task.id if job_invocation.last_task_id != task.id
      end

    end

  end
end
