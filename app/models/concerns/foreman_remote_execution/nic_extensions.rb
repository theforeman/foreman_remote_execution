module ForemanRemoteExecution
  module NicExtensions
    extend ActiveSupport::Concern

    included do
      before_validation :set_execution_flag
      validate :exclusive_execution_interface
    end

    private

    def set_execution_flag
      return unless primary? && host.present?
      self.execution = true if host.interfaces.detect(&:execution).nil?
    end

    def exclusive_execution_interface
      if host && self.execution?
        executions = host.interfaces.select { |i| i.execution? && i != self }
        errors.add :execution, _('host already has an execution interface') unless executions.empty?
      end
    end
  end
end
