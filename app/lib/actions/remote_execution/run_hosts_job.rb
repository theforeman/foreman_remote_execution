module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans
      def plan(job_invocation)
        action_subject(job_invocation)

        job_invocation.targeting.resolve_hosts!
        job_invocation.update_attribute :last_task_id, task.id
        input.update(:job_name => job_invocation.job_name)
        plan_self(job_invocation_id: job_invocation.id)
      end

      def create_sub_plans
        job_invocation = JobInvocation.find(input[:job_invocation_id])
        job_invocation.targeting.hosts.map do |host|
          trigger(RunHostJob, job_invocation, host)
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def run(event = nil)
        super unless event == Dynflow::Action::Skip
      end

      def output
        result = super
        result[:pending_count] = (result[:total_count] || 0) - (result[:failed_count] || 0) - (result[:success_count] || 0)
        result
      end
    end
  end
end
