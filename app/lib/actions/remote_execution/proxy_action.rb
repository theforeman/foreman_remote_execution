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
        newest = template_invocation.template_invocation_events.where.not(event_type: 'debug').last&.timestamp
        events = data['result'].map do |update|
          {
            template_invocation_id: template_invocation.id,
            event: update['output'],
            timestamp: Time.at(update['timestamp']),
            event_type: update['output_type'],
          }
        end
        if data['exit_status']
          events << {
            template_invocation_id: template_invocation.id,
            event: data['exit_status'],
            timestamp: events.last[:timestamp] + 0.0001,
            event_type: 'exit',
          }
        end
        events.select! { |event| newest.nil? || event[:timestamp] > newest }
        events.each_slice(1000) do |batch|
          TemplateInvocationEvent.insert_all(batch)
        end
      end
    end
  end
end
