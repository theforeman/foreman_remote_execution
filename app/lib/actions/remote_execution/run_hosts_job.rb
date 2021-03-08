module Actions
  module RemoteExecution
    class RunHostsJob < Actions::ActionWithSubPlans

      include Dynflow::Action::WithBulkSubPlans
      include Dynflow::Action::WithPollingSubPlans
      include Actions::RecurringAction

      middleware.use Actions::Middleware::BindJobInvocation
      middleware.use Actions::Middleware::RecurringLogic
      middleware.use Actions::Middleware::WatchDelegatedProxySubTasks

      execution_plan_hooks.use :notify_on_success, :on => :success
      execution_plan_hooks.use :notify_on_failure, :on => :failure

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
        provider = job_invocation.pattern_template_invocations.first&.template&.provider
        input[:proxy_batch_size] ||= provider&.proxy_batch_size || Setting['foreman_tasks_proxy_batch_size']
        trigger_action = plan_action(Actions::TriggerProxyBatch, batch_size: proxy_batch_size, total_count: hosts.count)
        input[:trigger_run_step_id] = trigger_action.run_step_id
      end

      def create_sub_plans
        proxy_selector = RemoteExecutionProxySelector.new

        current_batch.map do |host|
          # composer creates just "pattern" for template_invocations because target is evaluated
          # during actual run (here) so we build template invocations from these patterns
          template_invocation = job_invocation.pattern_template_invocation_for_host(host).deep_clone
          template_invocation.host_id = host.id
          trigger(RunHostJob, job_invocation, host, template_invocation, proxy_selector, { :use_concurrency_control => uses_concurrency_control })
        end
      end

      def spawn_plans
        super
      ensure
        trigger_remote_batch
      end

      def trigger_remote_batch
        batches_ready = (output[:planned_count] - output[:remote_triggered_count]) / proxy_batch_size
        return unless batches_ready > 0

        plan_event(Actions::TriggerProxyBatch::TriggerNextBatch[batches_ready], nil, step_id: input[:trigger_run_step_id])
        output[:remote_triggered_count] += proxy_batch_size * batches_ready
      end

      def on_planning_finished
        plan_event(Actions::TriggerProxyBatch::TriggerLastBatch, nil, step_id: input[:trigger_run_step_id])
        super
      end

      def finalize
        job_invocation.password = job_invocation.key_passphrase = job_invocation.effective_user_password = nil
        job_invocation.save!

        Rails.logger.debug "cleaning cache for keys that begin with 'job_invocation_#{job_invocation.id}'"
        Rails.cache.delete_matched(/\A#{JobInvocation::CACHE_PREFIX}_#{job_invocation.id}/)
      end

      def notify_on_success(_plan)
        job_invocation.build_notification.deliver!

        if [RexMailNotification::SUCCEEDED_JOBS, RexMailNotification::ALL_JOBS].include?(mail_notification_preference&.interval)
          RexJobMailer.job_finished(job_invocation, subject: _("REX job has succeeded - %s") % job_invocation.to_s).deliver_now
        end
      end

      def notify_on_failure(_plan)
        job_invocation.build_notification.deliver!

        if [RexMailNotification::FAILED_JOBS, RexMailNotification::ALL_JOBS].include?(mail_notification_preference&.interval)
          RexJobMailer.job_finished(job_invocation, subject: _("REX job has failed - %s") % job_invocation.to_s).deliver_now
        end
      end

      def job_invocation
        id = input[:job_invocation_id] || input.fetch(:job_invocation, {})[:id]
        @job_invocation ||= JobInvocation.find(id)
      end

      def batch(from, size)
        hosts.offset(from).limit(size)
      end

      def initiate
        output[:host_count] = total_count
        output[:remote_triggered_count] = 0
        super
      end

      def total_count
        # For compatibility with already existing tasks
        return output[:total_count] || hosts.count unless output.has_key?(:host_count) || task.pending?

        output[:host_count] || hosts.count
      end

      def hosts
        job_invocation.targeting.hosts.order("#{TargetingHost.table_name}.id")
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
        if event == Dynflow::Action::Skip
          plan_event(Dynflow::Action::Skip, nil, step_id: input[:trigger_run_step_id])
        else
          super
        end
      end

      def humanized_input
        input.fetch(:job_invocation, {}).fetch(:description, '')
      end

      def humanized_name
        '%s:' % _(super)
      end

      def proxy_batch_size
        input[:proxy_batch_size]
      end

      private

      def mail_notification_preference
        UserMailNotification.where(mail_notification_id: RexMailNotification.first, user_id: User.current.id).first
      end
    end
  end
end
