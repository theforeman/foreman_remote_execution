namespace :foreman_remote_execution do
  desc <<~DESC
      Explains which proxies can be used for remote execution against HOST using a specified PROVIDER.

        * HOST     : The HOST to find proxies for
        * PROVIDER : The PROVIDER to scope by
    DESC
  task :explain_proxy_selection => ['environment'] do
    options = {}
    options[:host] = ENV['HOST']
    options[:provider] = ENV['PROVIDER']

    raise 'Environment variable HOST has to be set' unless options[:host]
    raise 'Environment variable PROVIDER has to be set' unless options[:provider]

    User.current = User.anonymous_admin

    host = Host.friendly.find(options[:host])
    selector = ::RemoteExecutionProxySelector.new

    proxies = selector.available_proxies(host, options[:provider])
    determined_proxy = selector.determine_proxy(host, options[:provider])
    counts = selector.instance_variable_get('@tasks')

    selector.strategies.each_with_index do |strategy, index|
      puts "==> Strategy #{strategy}"
      if proxies[strategy].empty?
        puts " no proxies available using this strategy"
        puts
        next
      end

      proxies[strategy].sort_by { |proxy| counts[proxy] }.each_with_index do |proxy, i|
        puts " #{i + 1}) #{proxy} - #{counts[proxy]} tasks"
      end
      puts
    end

    if determined_proxy == :not_defined
      settings = {
        global_proxy: 'remote_execution_global_proxy',
        fallback_proxy: 'remote_execution_fallback_proxy',
        provider: options[:provider],
      }

      puts _('Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, ' +
             '%{fallback_proxy} in settings') % settings
    elsif determined_proxy == :not_available
      offline_proxies = selector.offline
      settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
      puts n_('The only applicable proxy %{proxy_names} is down',
              'All %{count} applicable proxies are down. Tried %{proxy_names}',
              offline_proxies.count) % settings
    else
      winning_strategy = selector.strategies.find { |strategy| !proxies[strategy].empty? && proxies[strategy].include?(determined_proxy) }
      puts "As of now, #{options[:provider]} job would use proxy #{determined_proxy}, determined by strategy #{winning_strategy}."
    end
  end
end
