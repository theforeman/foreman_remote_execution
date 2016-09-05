class RemoteExecutionProxySelector < ::ForemanTasks::ProxySelector
  def available_proxies(host, provider)
    host.remote_execution_proxies(provider)
  end
end
