module ForemanRemoteExecution
  module SmartProxyExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain :refresh, :remote_execution
    end

    def pubkey
      self[:pubkey] || update_pubkey
    end

    def update_pubkey
      return unless has_feature?('Ssh')
      key = ::ProxyAPI::RemoteExecutionSSH.new(:url => url).pubkey
      self.update_attribute(:pubkey, key) if key
      key
    end

    def refresh_with_remote_execution
      errors = refresh_without_remote_execution
      update_pubkey
      errors
    end
  end
end
