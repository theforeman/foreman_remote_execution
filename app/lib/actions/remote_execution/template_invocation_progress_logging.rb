module Actions
  module RemoteExecution
    module TemplateInvocationProgressLogging
      def template_invocation
        @template_invocation ||= TemplateInvocation.find_by(:run_host_job_task_id => task.id)
      end

      def log_template_invocation_exception(exception)
        last = template_invocation.template_invocation_events.order(:sequence_id).last
        id = last ? last.sequence_id + 1 : 0
        template_invocation.template_invocation_events.create!(
          :event_type => 'debug',
          :event => "#{exception.class}: #{exception.message}",
          :timestamp => Time.zone.now,
          :sequence_id => id
        )
      end

      def with_template_invocation_error_logging
        unless catch(::Dynflow::Action::ERROR) { yield || true }
          log_template_invocation_exception(error.exception)
          throw ::Dynflow::Action::ERROR
        end
      rescue => e # rubocop:disable Style/RescueStandardError
        log_template_invocation_exception(e)
        raise e
      end
    end
  end
end
