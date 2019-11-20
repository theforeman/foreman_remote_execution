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

    def drop_from_known_hosts(hostname)
      delete('known_hosts/' + hostname)
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to remove host from known hosts'))
    end
  end
end
