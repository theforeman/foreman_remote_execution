module ForemanRemoteExecution
  module SmartProxyExtensions
    def self.prepended(base)
      base.instance_eval do
        has_many :host_proxy_invocations, :dependent => :destroy
        has_many :template_invocations, :dependent => :nullify
      end
    end

    def ca_pubkey
      self[:ca_pubkey] || update_ca_pubkey
    end

    def pubkey
      self[:pubkey] || update_pubkey
    end

    def update_ca_pubkey
      update_key(:ca_pubkey)
    end

    def update_pubkey
      update_key(:pubkey)
    end

    def update_key(key_type)
      return unless has_feature?(%w(SSH Script))

      key = ::ProxyAPI::RemoteExecutionSSH.new(:url => url).send(key_type)
      self.update_attribute(key_type, key) if key
      key
    end

    def drop_host_from_known_hosts(host)
      ::ProxyAPI::RemoteExecutionSSH.new(:url => url).drop_from_known_hosts(host)
    end

    def refresh
      errors = super
      update_pubkey
      update_ca_pubkey
      errors
    end
  end
end
