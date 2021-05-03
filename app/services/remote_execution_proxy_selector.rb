class RemoteExecutionProxySelector < ::ForemanTasks::ProxySelector

  INTERNAL_PROXY = 'internal'.freeze

  def available_proxies(host, provider)
    host.remote_execution_proxies(provider)
  end
end
