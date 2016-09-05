module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans

      middleware.use Actions::Middleware::BindJobInvocation
      middleware.use Actions::Middleware::RecurringLogic

      def delay(delay_options, job_invocation, locked = false)
        task.add_missing_task_groups(job_invocation.task_group)
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.static?
        super delay_options, job_invocation, locked
      end

      def plan(job_invocation, locked = false)
        set_up_concurrency_control job_invocation
        job_invocation.task_group.save! if job_invocation.task_group.try(:new_record?)
        task.add_missing_task_groups(job_invocation.task_group) if job_invocation.task_group
        action_subject(job_invocation) unless locked
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.dynamic? || !locked
        input.update(:job_category => job_invocation.job_category)
        plan_self(:job_invocation_id => job_invocation.id)
      end

      def create_sub_plans
        job_invocation = JobInvocation.find(input[:job_invocation_id])
        proxy_selector = RemoteExecutionProxySelector.new

        # composer creates just "pattern" for template_invocations because target is evaluated
        # during actual run (here) so we build template invocations from these patterns
        job_invocation.targeting.hosts.map do |host|
          template_invocation = job_invocation.pattern_template_invocation_for_host(host).deep_clone
          template_invocation.host_id = host.id
          trigger(RunHostJob, job_invocation, host, template_invocation, proxy_selector)
        end
      end

      def set_up_concurrency_control(invocation)
        limit_concurrency_level invocation.concurrency_level unless invocation.concurrency_level.nil?
        distribute_over_time invocation.time_span unless invocation.time_span.nil?
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def run(event = nil)
        super unless event == Dynflow::Action::Skip
      end

      def humanized_input
        input[:job_invocation][:description]
      end

      def humanized_name
        '%s:' % _(super)
      end
    end
  end
end
