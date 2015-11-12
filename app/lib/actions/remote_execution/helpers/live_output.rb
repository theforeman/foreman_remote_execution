module Actions
  module RemoteExecution
    module Helpers
      module LiveOutput
        def exception_to_output(context, exception, timestamp = Time.now)
          format_output(context + ": #{exception.class} - #{exception.message}", 'debug', timestamp)
        end

        def format_output(message, type = 'debug', timestamp = Time.now)
          { 'output_type' => type,
            'output' => message,
            'timestamp' => timestamp.to_f }
        end
      end
    end
  end
end
