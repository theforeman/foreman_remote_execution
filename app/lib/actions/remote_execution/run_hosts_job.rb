module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans

      include Dynflow::Action::WithBulkSubPlans
      include Dynflow::Action::WithPollingSubPlans
      include Actions::RecurringAction

      middleware.use Actions::Middleware::BindJobInvocation
      middleware.use Actions::Middleware::RecurringLogic
      middleware.use Actions::Middleware::WatchDelegatedProxySubTasks
      middleware.use Actions::Middleware::ProxyBatchTriggering

      class CheckOnProxyActions; end

      def queue
        ForemanRemoteExecution::DYNFLOW_QUEUE
      end

      def delay(delay_options, job_invocation)
        task.add_missing_task_groups(job_invocation.task_group)
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.static? && !job_invocation.targeting.resolved?
        input.update :job_invocation => job_invocation.to_action_input
        super delay_options, job_invocation
      end

      def plan(job_invocation)
        job_invocation.task_group.save! if job_invocation.task_group.try(:new_record?)
        task.add_missing_task_groups(job_invocation.task_group) if job_invocation.task_group
        action_subject(job_invocation)
        job_invocation.targeting.resolve_hosts! if job_invocation.targeting.dynamic? || !job_invocation.targeting.resolved?
        set_up_concurrency_control job_invocation
        input.update(:job_category => job_invocation.job_category)
        plan_self(:job_invocation_id => job_invocation.id)
      end

      def create_sub_plans
        proxy_selector = RemoteExecutionProxySelector.new

        current_batch.map do |host|
          # composer creates just "pattern" for template_invocations because target is evaluated
          # during actual run (here) so we build template invocations from these patterns
          template_invocation = job_invocation.pattern_template_invocation_for_host(host).deep_clone
          template_invocation.host_id = host.id
          trigger(RunHostJob, job_invocation, host, template_invocation, proxy_selector)
        end
      end

      def finalize
        job_invocation.password = job_invocation.key_passphrase = job_invocation.sudo_password = nil
        job_invocation.save!

        Rails.logger.debug "cleaning cache for keys that begin with 'job_invocation_#{job_invocation.id}'"
        Rails.cache.delete_matched(/\A#{JobInvocation::CACHE_PREFIX}_#{job_invocation.id}/)
        # creating the success notification should be the very last thing this tasks do
        job_invocation.build_notification.deliver!
      end

      def job_invocation
        @job_invocation ||= JobInvocation.find(input[:job_invocation_id])
      end

      def batch(from, size)
        hosts.offset(from).limit(size)
      end

      def total_count
        hosts.count
      end

      def hosts
        job_invocation.targeting.hosts.order(:name, :id)
      end

      def set_up_concurrency_control(invocation)
        limit_concurrency_level invocation.concurrency_level unless invocation.concurrency_level.nil?
        unless invocation.time_span.nil?
          distribute_over_time(invocation.time_span,
                               invocation.targeting.hosts.count)
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def run(event = nil)
        super unless event == Dynflow::Action::Skip
      end

      def humanized_input
        input.fetch(:job_invocation, {}).fetch(:description, '')
      end

      def humanized_name
        '%s:' % _(super)
      end
    end
  end
end
