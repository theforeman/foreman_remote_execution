module ForemanRemoteExecution
  module HostExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain :build_required_interfaces, :remote_execution
      alias_method_chain :reload, :remote_execution
      alias_method_chain :becomes, :remote_execution
      alias_method_chain :params, :remote_execution

      has_many :targeting_hosts, :dependent => :destroy, :foreign_key => 'host_id'

      has_one :execution_status_object, :class_name => 'HostStatus::ExecutionStatus', :foreign_key => 'host_id'

      scoped_search :in => :execution_status_object, :on => :status, :rename => :execution_status,
                    :complete_value => { :ok => HostStatus::ExecutionStatus::OK, :error => HostStatus::ExecutionStatus::ERROR }
    end

    def execution_status(options = {})
      @execution_status ||= get_status(HostStatus::ExecutionStatus).to_status(options)
    end

    def execution_status_label(options = {})
      @execution_status_label ||= get_status(HostStatus::ExecutionStatus).to_label(options)
    end

    def params_with_remote_execution
      params = params_without_remote_execution
      keys = remote_execution_ssh_keys
      params['remote_execution_ssh_keys'] = keys unless keys.blank?
      [:remote_execution_ssh_user, :remote_execution_effective_user_method].each do |key|
        params[key.to_s] = Setting[key] unless params.key?(key.to_s)
      end
      params
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

    def remote_execution_ssh_keys
      remote_execution_proxies('SSH').values.flatten.uniq.map { |proxy| proxy.pubkey }.compact.uniq
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
