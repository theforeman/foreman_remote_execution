module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans

      middleware.use Actions::Middleware::BindJobInvocation

      def delay(delay_options, job_invocation)
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.static?
        action_subject(job_invocation)
        super(delay_options, job_invocation, true)
      end

      def plan(job_invocation, locked = false, connection_options = {})
        action_subject(job_invocation) unless locked
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.dynamic? || !locked
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
