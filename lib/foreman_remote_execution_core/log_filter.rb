module ForemanRemoteExecutionCore
  class LogFilter < ::Logger
    def initialize(base_logger)
      @base_logger = base_logger
    end

    def add(severity, *args)
      severity ||= ::Logger::UNKNOWN
      return true if @base_logger.nil? || severity < @level

      @base_logger.add(severity, *args)
    end
  end
end
