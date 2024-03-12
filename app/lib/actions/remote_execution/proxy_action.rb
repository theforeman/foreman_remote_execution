module Actions
  module RemoteExecution
    class ProxyAction < ::Actions::ProxyAction
      include Actions::RemoteExecution::TemplateInvocationProgressLogging

      def on_data(data, meta = {})
        super
        process_proxy_data(output[:proxy_output])
      end

      def run(event = nil)
        with_template_invocation_error_logging { super }
      end

      private

      def get_proxy_data(response)
        data = super
        process_proxy_data(data)
        data
      end

      def process_proxy_data(data)
        events = data['result'].each_with_index.map do |update, seq_id|
          {
            # For N-1 compatibility, we assume that the output provided here is
            # complete
            sequence_id: update['sequence_id'] || seq_id,
            template_invocation_id: template_invocation.id,
            event: update['output'],
            timestamp: Time.at(update['timestamp']).getlocal,
            event_type: update['output_type'],
          }
        end
        if data['exit_status']
          last = events.last || {:sequence_id => -1, :timestamp => Time.zone.now}
          events << {
            sequence_id: last[:sequence_id] + 1,
            template_invocation_id: template_invocation.id,
            event: data['exit_status'],
            timestamp: last[:timestamp],
            event_type: 'exit',
          }
        end
        events.each_slice(1000) do |batch|
          TemplateInvocationEvent.insert_all(batch, unique_by: [:template_invocation_id, :sequence_id]) # rubocop:disable Rails/SkipsModelValidations
        end
      end
    end
  end
end
