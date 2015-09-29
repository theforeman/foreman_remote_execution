class ProxyLoadBalancer
  def initialize
    @tasks   = {}
    @offline = []
  end

  # Get the least loaded proxy from the given list of proxies
  def next(proxies)
    exclude = @tasks.keys + @offline
    @tasks.merge!(get_counts(proxies - exclude))
    next_proxy = @tasks.select { |proxy, _| proxies.include?(proxy) }.min_by { |_, job_count| job_count }.first
    @tasks[next_proxy] += 1
    next_proxy
  end

  private

  def get_counts(proxies)
    proxies.inject({}) do |result, proxy|
      begin
        proxy_api = ProxyAPI::ForemanDynflow::DynflowProxy.new(:url => proxy.url)
        result[proxy] = proxy_api.tasks_count('running')
        result
      rescue
        @offline << proxy
        Rails.logger.error("Could not fetch task counts from #{proxy}, skipped.")
        result
      end
    end
  end
end
