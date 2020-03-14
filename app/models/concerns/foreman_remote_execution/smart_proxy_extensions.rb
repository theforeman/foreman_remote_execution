module ForemanRemoteExecution
  module SmartProxyExtensions
    def pubkey
      self[:pubkey] || update_pubkey
    end

    def update_pubkey
      return unless has_feature?('SSH')

      key = ::ProxyAPI::RemoteExecutionSSH.new(:url => url).pubkey
      self.update_attribute(:pubkey, key) if key
      key
    end

    def refresh
      errors = super
      update_pubkey
      errors
    end
  end
end
