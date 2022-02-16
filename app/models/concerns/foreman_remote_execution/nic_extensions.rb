module ForemanRemoteExecution
  module NicExtensions
    extend ActiveSupport::Concern

    included do
      validate :exclusive_execution_interface
      before_validation :move_execution_flag
    end

    private

    def move_execution_flag
      return unless host && self.execution?

      host.interfaces
          .select { |i| i.execution? && i != self }
          .each { |i| i.execution = false }
    end

    def exclusive_execution_interface
      if host && self.execution?
        executions = host.interfaces.select { |i| i.execution? && i != self }
        errors.add :execution, _('host already has an execution interface') unless executions.empty?
      end
    end
  end
end
