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
  end
end
