module Actions
  module RemoteExecution
    class JobRun < Actions::ActionWithSubPlans
      def plan(job_invocation)
        job_invocation.targeting.resolve_hosts!
        plan_self(job_invocation_id: job_invocation.id)
      end

      def create_sub_plans
        job_invocation = JobInvocation.find(job_invocation.id)
        job_invocation.targeting.hosts.map do |host|
          trigger(JobRunHost, job_invocation, host)
        end
      end
    end
  end
end
