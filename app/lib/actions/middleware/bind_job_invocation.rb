module Actions
  module Middleware

    class BindJobInvocation < ::Dynflow::Middleware

      def delay(*args)
        schedule_options, job_invocation = args
        if !job_invocation.task_id.nil? && job_invocation.task_id != task.id
          job_invocation = job_invocation.deep_clone!
          args = [schedule_options, job_invocation]
        end
        pass(*args).tap { bind(job_invocation) }
      end

      def plan(*args)
        job_invocation = args.first
        pass(*args).tap { bind(job_invocation) }
      end

      private

      def task
        @task ||= ForemanTasks::Task::DynflowTask.where(:external_id => action.execution_plan_id).first!
      end

      def bind(job_invocation)
        job_invocation.update_attribute :task_id, task.id if job_invocation.task_id != task.id
      end

    end

  end
end
