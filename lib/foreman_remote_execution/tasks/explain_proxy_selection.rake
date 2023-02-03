namespace :foreman_remote_execution do
  desc <<~DESC
    Explains which proxies can be used for remote execution against HOST using a specified PROVIDER.

      * HOST         : A scoped search query to find hosts by
      * PROVIDER     : The PROVIDER to scope by
      * FORMAT       : Output format, one of verbose (or unset), json, pretty-json, csv
      * FOREMAN_USER : Run as if FOREMAN_USER triggered a job (runs as anonymous_admin if unset)
      * ORGANIZATION : Run in the context of ORGANIZATION (runs in any context if unset)
      * LOCATION     : Run in the context of LOCATION (runs in any context if unset)
  DESC
  task :explain_proxy_selection => ['environment'] do
    options = {}
    options[:host] = ENV['HOST']
    options[:provider] = ENV['PROVIDER']

    providers = ::RemoteExecutionProvider.provider_proxy_features

    raise 'Environment variable HOST has to be set' unless options[:host]
    unless providers.include?(options[:provider])
      aliases = providers.group_by { |p| ::RemoteExecutionProvider.provider_for(p) }
                         .select { |_, names| names.count > 1 }
                         .values
                         .map { |a| a.join(' = ') }
      raise "Environment variable PROVIDER has to be set to one of #{providers.join(', ')}. Note provider aliases #{aliases.join(', ')}."
    end

    if ENV['FOREMAN_USER']
      User.current = User.friendly.find(ENV['FOREMAN_USER'])
    else
      User.current = User.anonymous_admin
    end
    Location.current = Location.friendly.find(ENV['LOCATION']) if ENV['LOCATION']
    Organization.current = Organization.friendly.find(ENV['ORGANIZATION']) if ENV['ORGANIZATION']

    selector = ::RemoteExecutionProxySelector.new
    provider = ::RemoteExecutionProvider.provider_for(options[:provider])

    results = Host.search_for(options[:host]).map do |host|
      host_base = { :host => host }
      proxies = selector.available_proxies(host, provider.proxy_feature)
      determined_proxy = selector.determine_proxy(host, provider.proxy_feature)
      counts = selector.instance_variable_get('@tasks')
      counts.default = 0

      strategies = selector.strategies.map do |strategy|
        base = { :name => strategy, :enabled => !proxies[strategy].nil? }
        next base if proxies[strategy].nil?

        base.merge(:proxies =>  proxies[strategy].sort_by { |proxy| counts[proxy] }.map do |proxy|
                                  {:proxy => proxy, :count => counts[proxy]}
                                end)
      end

      case determined_proxy
      when :not_defined
        settings = {
          global_proxy: 'remote_execution_global_proxy',
          fallback_proxy: 'remote_execution_fallback_proxy',
          provider: options[:provider],
        }

        host_base[:detail] = _('Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, ' +
                               '%{fallback_proxy} in settings') % settings
      when :not_available
        offline_proxies = selector.offline
        settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
        host_base[:detail] = n_('The only applicable proxy %{proxy_names} is down',
          'All %{count} applicable proxies are down. Tried %{proxy_names}',
          offline_proxies.count) % settings
      else
        winning_strategy = selector.strategies.find { |strategy| !proxies[strategy].empty? && proxies[strategy].include?(determined_proxy) }
      end

      {
        :host => host,
        :strategies => strategies,
        :selected_proxy => determined_proxy,
        :winning_strategy => winning_strategy,
      }
    end

    case ENV['FORMAT']
    when nil, 'verbose'
      output_verbose(results, options[:provider])
    when 'csv'
      require 'csv'
      output_csv(results)
    when 'json'
      require 'json'
      puts JSON.generate(results)
    when 'pretty-json'
      require 'json'
      puts JSON.pretty_generate(results)
    end
  end

  def output_verbose(results, provider)
    errors = [:not_defined, :not_available]

    results.each do |host|
      puts "=> Host #{host[:host]}"
      host[:strategies].each do |strategy|
        puts "==> Strategy #{strategy[:name]}"
        unless strategy[:enabled]
          puts " strategy is disabled"
          puts
          next
        end
        if strategy[:proxies].empty?
          puts " no proxies available using this strategy"
        else
          strategy[:proxies].each_with_index do |proxy_record, i|
            puts " #{i + 1}) #{proxy_record[:proxy]} - #{proxy_record[:count]} tasks"
          end
        end
        puts
      end
      if errors.include? host[:selected_proxy]
        puts host[:detail]
      else
        puts "As of now, #{provider} job would use proxy #{host[:selected_proxy]}, determined by strategy #{host[:winning_strategy]}."
      end
      puts
    end
  end

  def output_csv(results)
    writer = CSV.new($stdout)
    writer << %w(host strategy proxy)
    results.each do |host|
      writer << [
        host[:host].name,
        host[:winning_strategy],
        host[:selected_proxy],
      ]
    end
    writer.close
  end
end
