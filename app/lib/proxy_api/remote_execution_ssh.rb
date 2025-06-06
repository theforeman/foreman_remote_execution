module ::ProxyAPI
  class RemoteExecutionSSH < ::ProxyAPI::Resource
    def initialize(args)
      @url = args[:url] + '/ssh'
      super args
    end

    def pubkey
      get('pubkey').strip
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to fetch public key'))
    end

    def ca_pubkey
      get('ca_pubkey')&.strip
    rescue RestClient::ResourceNotFound => e
      Rails.logger.warn(format(N_("Unable to fetch CA public key: %{error}"), error: e.message))
      nil
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to fetch CA public key'))
    end

    def drop_from_known_hosts(hostname)
      delete('known_hosts/' + hostname)
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to remove host from known hosts'))
    end
  end
end
