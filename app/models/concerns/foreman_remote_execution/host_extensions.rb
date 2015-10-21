module ForemanRemoteExecution
  module HostExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain :build_required_interfaces, :remote_execution
      alias_method_chain :reload, :remote_execution
      alias_method_chain :becomes, :remote_execution

      has_many :targeting_hosts, :dependent => :destroy, :foreign_key => 'host_id'
    end

    def execution_interface
      get_interface_by_flag(:execution)
    end

    def remote_execution_proxies(provider)
      proxies = {}
      proxies[:subnet]   = execution_interface.subnet.remote_execution_proxies.with_features(provider) if execution_interface && execution_interface.subnet
      proxies[:fallback] = smart_proxies.with_features(provider) if Setting[:remote_execution_fallback_proxy]

      if Setting[:remote_execution_global_proxy]
        proxy_scope = if Taxonomy.enabled_taxonomies.any?
                        ::SmartProxy.with_taxonomy_scope_override(location, organization)
                      else
                        proxy_scope = ::SmartProxy
                      end

        proxies[:global] = proxy_scope.authorized.with_features(provider)
      end

      proxies
    end

    def drop_execution_interface_cache
      @execution_interface = nil
    end

    def becomes_with_remote_execution(*args)
      became = becomes_without_remote_execution(*args)
      became.drop_execution_interface_cache if became.respond_to? :drop_execution_interface_cache
      became
    end

    def reload_with_remote_execution(*args)
      drop_execution_interface_cache
      reload_without_remote_execution(*args)
    end

    private

    def build_required_interfaces_with_remote_execution(attrs = {})
      build_required_interfaces_without_remote_execution(attrs)
      self.primary_interface.execution = true if self.execution_interface.nil?
    end
  end
end
