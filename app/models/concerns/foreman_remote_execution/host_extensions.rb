module ForemanRemoteExecution
  module HostExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain :build_required_interfaces, :remote_execution
      alias_method_chain :reload, :remote_execution
      alias_method_chain :becomes, :remote_execution
      alias_method_chain :host_params, :remote_execution

      has_many :targeting_hosts, :dependent => :destroy, :foreign_key => 'host_id'
      has_many :template_invocations, :dependent => :destroy, :foreign_key => 'host_id', :inverse_of => :host
      has_one :execution_status_object, :class_name => 'HostStatus::ExecutionStatus', :foreign_key => 'host_id'

      has_many :job_invocations, :through => :template_invocations,
               :class_name => '::JobInvocation',
               :source => 'job_invocation'

      has_many :run_host_job_tasks, :class_name => 'ForemanTasks::Task',
               :through => :template_invocations,
               :source => 'run_host_job_task'

      scoped_search :relation => :run_host_job_tasks, :on => :result, :rename => 'job_task.result',
                    :ext_method => :search_by_job_invocation,
                    :only_explicit => true,
                    :complete_value => { :error => 'error', :success => 'success',
                                         :pending => 'pending', :warning => 'warning',
                                         :cancelled => 'cancelled' }

      scoped_search :relation => :template_invocations, :on => :job_invocation_id,
                    :rename => 'job_invocation.id', :only_explicit => true, :ext_method => :search_by_job_invocation

      scoped_search :in => :execution_status_object, :on => :status, :rename => :execution_status,
                    :complete_value => { :ok => HostStatus::ExecutionStatus::OK, :error => HostStatus::ExecutionStatus::ERROR }

      scoped_search :relation => :template_invocations, :on => :job_invocation_id,
                    :rename => 'failed_job_invocation.id', :only_explicit => true,
                    :ext_method => :search_failed_by_id

      def self.search_by_job_invocation(key, operator, value)
        mapping = {
          'job_invocation.id' => %Q("#{TemplateInvocation.table_name}"."job_invocation_id" #{operator} ?),
          'job_task.result'   => %Q("#{ForemanTasks::Task.table_name}"."result" #{operator} ?)
        }
        {
          :conditions => sanitize_sql_for_conditions([mapping[key], value_to_sql(operator, value)]),
          :joins => { :template_invocations => [:run_host_job_task] }
        }
      end
    end

    def execution_status(options = {})
      @execution_status ||= get_status(HostStatus::ExecutionStatus).to_status(options)
    end

    def execution_status_label(options = {})
      @execution_status_label ||= get_status(HostStatus::ExecutionStatus).to_label(options)
    end

    def host_params_with_remote_execution
      params = host_params_without_remote_execution
      keys = remote_execution_ssh_keys
      params['remote_execution_ssh_keys'] = keys unless keys.blank?
      [:remote_execution_ssh_user, :remote_execution_effective_user_method,
       :remote_execution_connect_by_ip].each do |key|
        params[key.to_s] = Setting[key] unless params.key?(key.to_s)
      end
      params
    end

    def execution_interface
      get_interface_by_flag(:execution)
    end

    # rubocop:disable Metrics/PerceivedComplexity
    def remote_execution_proxies(provider, authorized = true)
      proxies = {}
      proxies[:subnet]   = execution_interface.subnet.remote_execution_proxies.with_features(provider) if execution_interface && execution_interface.subnet
      proxies[:fallback] = smart_proxies.with_features(provider) if Setting[:remote_execution_fallback_proxy]

      if Setting[:remote_execution_global_proxy]
        proxy_scope = if Taxonomy.enabled_taxonomies.any? && User.current.present?
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
      remote_execution_proxies('SSH', false).values.flatten.uniq.map { |proxy| proxy.pubkey }.compact.uniq
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
