module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans
      def plan(job_invocation, connection_options = {})
        action_subject(job_invocation)

        job_invocation.targeting.resolve_hosts!
        job_invocation.update_attribute :last_task_id, task.id
        input.update(:job_name => job_invocation.job_name)
        plan_self(:job_invocation_id => job_invocation.id, :connection_options => connection_options)
      end

      def create_sub_plans
        job_invocation = JobInvocation.find(input[:job_invocation_id])
        job_invocation.targeting.hosts.map do |host|
          trigger(RunHostJob, job_invocation, host, input[:connection_options])
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def run(event = nil)
        super unless event == Dynflow::Action::Skip
      end
    end
  end
end
