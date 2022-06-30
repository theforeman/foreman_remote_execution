module ForemanRemoteExecution
  module SmartProxyHelperExtensions
    def feature_actions(proxy, authorizer)
      actions = super
      actions << proxy_update_button(proxy, authorizer) if can_update_proxy?(proxy)
      actions
    end

    def can_update_proxy?(proxy)
      hosts = proxy.smart_proxy_hosts

      return if !can_schedule_jobs? ||
                hosts.empty? ||
                !hosts.all? { |host| can_execute_on_host?(host) }

      version = proxy.statuses[:version].version

      # TODO: Extract this into a service in Foreman
      ::SmartProxiesController.allocate.send(:versions_mismatched?, version)
    end

    def proxy_update_button(proxy, _authorizer)
      feature = RemoteExecutionFeature.feature(proxy_update_feature)
      return if feature.nil?

      path = job_invocations_path(:host_ids => proxy.infrastructure_host_facets.pluck(:id),
                                  :feature => feature.label,
                                  :inputs => { :target_version => proxy_update_target_version })
      link_to(_('%s') % feature.name, path, :method => :post)
    end

    def proxy_update_feature
      :update_smart_proxy
    end

    def proxy_update_target_version
      Foreman::Version.new.short
    end
  end
end
