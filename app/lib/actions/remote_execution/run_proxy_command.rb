module Actions
  module RemoteExecution
    class RunProxyCommand < Actions::ProxyAction
      include ::Dynflow::Action::Cancellable
      include Actions::RemoteExecution::Helpers::LiveOutput

      def on_data(data)
        if data[:result] == 'initialization_error'
          handle_connection_exception(data[:metadata][:exception_class]
                                       .constantize
                                       .new(data[:metadata][:exception_message]))
        else
          super(data)
          error! _('Script execution failed') if failed_run?
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def failed_run?
        output[:result] == 'initialization_error' ||
          (exit_status && proxy_output[:exit_status] != 0)
      end

      def exit_status
        proxy_output && proxy_output[:exit_status]
      end

      def live_output
        records = connection_messages
        if !task.pending?
          records.concat(finalized_output)
        else
          records.concat(current_proxy_output)
        end
        records.sort_by { |record| record['timestamp'].to_f }
      end

      private

      def connection_messages
        metadata.fetch(:failed_proxy_tasks, []).map do |failure_data|
          format_output(_('Initialization error: %s') % "#{failure_data[:exception_class]} - #{failure_data[:exception_message]}", 'debug', failure_data[:timestamp])
        end
      end

      def current_proxy_output
        return [] unless output[:proxy_task_id]
        proxy_data = proxy.status_of_task(output[:proxy_task_id])['actions'].detect { |action| action['class'] == proxy_action_name }
        proxy_data.fetch('output', {}).fetch('result', [])
      rescue => e
        ::Foreman::Logging.exception("Failed to load data for task #{task.id} from proxy #{input[:proxy_url]}", e)
        [exception_to_output(_('Error loading data from proxy'), e)]
      end

      def finalized_output
        records = []

        if proxy_result.present?
          records.concat(proxy_result)
        else
          records << format_output(_('No output'))
        end

        if exit_status
          records << format_output(_('Exit status: %s') % exit_status, 'stdout', final_timestamp(records))
        elsif run_step && run_step.error
          records << format_output(_('Job finished with error') + ": #{run_step.error.exception_class} - #{run_step.error.message}", 'debug', final_timestamp(records))
        end
        return records
      end

      def final_timestamp(records)
        return task.ended_at if records.blank?
        records.last.fetch('timestamp', task.ended_at).to_f + 1
      end

      def proxy_result
        self.output.fetch(:proxy_output, {}).fetch(:result, []) || []
      end
    end
  end
end
