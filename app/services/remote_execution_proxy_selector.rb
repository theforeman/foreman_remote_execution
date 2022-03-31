class RemoteExecutionProxySelector < ::ForemanTasks::ProxySelector

  INTERNAL_PROXY = 'internal'.freeze

  def available_proxies(host, provider, capability: nil)
    proxies = host.remote_execution_proxies(provider)
    return proxies if capability.nil?

    proxies.reduce({}) do |acc, (strategy, possible_proxies)|
      acc.merge(strategy => possible_proxies.select { |proxy| proxy.has_capability?(capability) })
    end
  end
end
