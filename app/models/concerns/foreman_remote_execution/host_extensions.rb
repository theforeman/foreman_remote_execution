module ForemanRemoteExecution
  module HostExtensions
    def self.prepended(base)
      base.instance_eval do
        has_many :targeting_hosts, :dependent => :destroy, :foreign_key => 'host_id'
        has_many :template_invocations, :dependent => :destroy, :foreign_key => 'host_id'
        has_one :execution_status_object, :class_name => 'HostStatus::ExecutionStatus', :foreign_key => 'host_id', :dependent => :destroy
        has_many :run_host_job_tasks, :through => :template_invocations
        has_many :host_proxy_invocations, :foreign_key => 'host_id', :dependent => :destroy
        has_many :executed_through_proxies, :through => :host_proxy_invocations, :source => 'smart_proxy'

        scoped_search :relation => :run_host_job_tasks, :on => :result, :rename => 'job_invocation.result',
          :ext_method => :search_by_job_invocation,
          :only_explicit => true,
          :complete_value => TemplateInvocation::TaskResultMap::REVERSE_MAP

        scoped_search :relation => :template_invocations, :on => :job_invocation_id,
          :rename => 'job_invocation.id', :only_explicit => true, :ext_method => :search_by_job_invocation

        scoped_search :relation => :execution_status_object, :on => :status, :rename => :execution_status,
          :complete_value => { :ok => HostStatus::ExecutionStatus::OK, :error => HostStatus::ExecutionStatus::ERROR }

        scope :execution_scope, lambda {
          if User.current&.can?('execute_jobs_on_infrastructure_hosts')
            self
          else
            search_for('not (infrastructure_facet.foreman = true or set? infrastructure_facet.smart_proxy_id)')
          end
        }

        def search_by_job_invocation(key, operator, value)
          if key == 'job_invocation.result'
            operator = operator == '=' ? 'IN' : 'NOT IN'
            value = TemplateInvocation::TaskResultMap.status_to_task_result(value)
          end

          mapping = {
            'job_invocation.id'     => %(#{TemplateInvocation.table_name}.job_invocation_id #{operator} ?),
            'job_invocation.result' => %(#{ForemanTasks::Task.table_name}.result #{operator} (?)),
          }
          {
            :conditions => sanitize_sql_for_conditions([mapping[key], value_to_sql(operator, value)]),
            :joins => { :template_invocations => [:run_host_job_task] },
          }
        end
      end
    end

    def cockpit_url
      ScriptExecutionProvider.cockpit_url_for_host(self.name)
    end

    def execution_status(options = {})
      @execution_status ||= get_status(HostStatus::ExecutionStatus).to_status(options)
    end

    def execution_status_label(options = {})
      @execution_status_label ||= get_status(HostStatus::ExecutionStatus).to_label(options)
    end

    # rubocop:disable Naming/MemoizedInstanceVariableName
    def host_params_hash
      @cached_rex_host_params_hash ||= extend_host_params_hash(super)
    end
    # rubocop:enable Naming/MemoizedInstanceVariableName

    def execution_interface
      get_interface_by_flag(:execution)
    end

    def set_execution_interface(identifier)
      if interfaces.find_by(identifier: identifier).nil?
        msg = (N_("Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.") % identifier)
        raise ActiveRecord::RecordNotFound, msg
      end

      # Only one interface at time can be used for REX, all other must be set to false
      interfaces.each { |int| int.execution = (int.identifier == identifier) }
      interfaces.each(&:save!)
    end

    def remote_execution_proxies(provider, authorized = true)
      proxies = {}
      proxies[:subnet] = []
      proxies[:subnet] += execution_interface.subnet6.remote_execution_proxies.with_features(provider) if execution_interface&.subnet6
      proxies[:subnet] += execution_interface.subnet.remote_execution_proxies.with_features(provider) if execution_interface&.subnet
      proxies[:subnet].uniq!
      proxies[:fallback] = smart_proxies.with_features(provider) if Setting[:remote_execution_fallback_proxy]

      if Setting[:remote_execution_global_proxy]
        proxy_scope = if User.current.present?
                        ::SmartProxy.with_taxonomy_scope_override(location, organization)
                      else
                        ::SmartProxy.unscoped
                      end

        proxy_scope = proxy_scope.authorized if authorized
        proxies[:global] = proxy_scope.with_features(provider)
      end

      proxies
    end

    def remote_execution_ssh_keys
      remote_execution_proxies(%w(SSH Script), false).values.flatten.uniq.map { |proxy| proxy.pubkey }.compact.uniq
    end

    def drop_execution_interface_cache
      @execution_interface = nil
    end

    def becomes(*args)
      became = super(*args)
      became.drop_execution_interface_cache if became.respond_to? :drop_execution_interface_cache
      became
    end

    def reload(*args)
      drop_execution_interface_cache
      super(*args)
    end

    def clear_host_parameters_cache!
      super
      @cached_rex_host_params_hash = nil
    end

    def infrastructure_host?
      infrastructure_facet&.foreman_instance || infrastructure_facet&.smart_proxy_id
    end

    private

    def extend_host_params_hash(params)
      keys = remote_execution_ssh_keys
      source = 'global'
      if keys.present?
        value, safe_value = params.fetch('remote_execution_ssh_keys', {}).values_at(:value, :safe_value).map { |v| [v].flatten.compact }
        params['remote_execution_ssh_keys'] = {:value => value + keys, :safe_value => safe_value + keys, :source => source}
      end
      [:remote_execution_ssh_user, :remote_execution_effective_user_method,
       :remote_execution_connect_by_ip].each do |key|
        value = Setting[key]
        params[key.to_s] = {:value => value, :safe_value => value, :source => source} unless params.key?(key.to_s)
      end
      params
    end

    def build_required_interfaces(attrs = {})
      super(attrs)
      self.primary_interface.execution = true if self.execution_interface.nil?
    end
  end
end

module Host
  class Managed
    class Jail < Safemode::Jail
      allow :execution_interface
    end
  end
end
