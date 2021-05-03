module ForemanRemoteExecutionCore
  class LogFilter < ::Logger
    def initialize(base_logger)
      @base_logger = base_logger
    end

    def add(severity, *args, &block)
      severity ||= ::Logger::UNKNOWN
      return true if @base_logger.nil? || severity < @level

      @base_logger.add(severity, *args, &block)
    end
  end
end
