class RemoteExecutionProvider

  EFFECTIVE_USER_METHODS = %w[sudo dzdo su].freeze

  class << self
    def provider_for(type)
      providers[type.to_s] || providers[:SSH]
    end

    def providers
      @providers ||= { }.with_indifferent_access
    end

    def register(key, klass)
      providers[key.to_sym] = klass
    end

    def provider_names
      providers.keys.map(&:to_s)
    end

    def proxy_command_options(template_invocation, host)
      {:proxy_operation_name => proxy_operation_name}
    end

    def secrets(_host)
      {}
    end

    def proxy_operation_name
      'ssh'
    end

    def humanized_name
      self.name
    end

    def supports_effective_user?
      false
    end

    def effective_user(template_invocation)
      template_invocation.effective_user
    end

    def effective_user_method(host)
      method = host_setting(host, :remote_execution_effective_user_method)
      unless EFFECTIVE_USER_METHODS.include?(method)
        raise _('Effective user method "%{current_value}" is not one of %{valid_methods}') %
                  { :current_value => method, :valid_methods => EFFECTIVE_USER_METHODS}
      end
      method
    end

    def cleanup_working_dirs?(host)
      setting = host_setting(host, :remote_execution_cleanup_working_dirs)
      [true, 'true', 'True', 'TRUE', '1'].include?(setting)
    end

    def sudo_password(host)
      host_setting(host, :remote_execution_sudo_password)
    end

    def effective_interfaces(host)
      interfaces = []
      %w(execution primary provision).map do |flag|
        interfaces << host.send(flag + '_interface')
      end
      interfaces.compact.uniq
    end

    def find_ip_or_hostname(host)
      interfaces = effective_interfaces host

      find_ip(host, interfaces) || find_fqdn(interfaces) || raise(_('Could not find any suitable interface for execution'))
    end

    def find_ip(host, interfaces)
      if host_setting(host, :remote_execution_connect_by_ip)
        interfaces.find { |i| i.ip.present? }.try(:ip)
      end
    end

    def find_fqdn(interfaces)
      interfaces.find { |i| i.fqdn.present? }.try(:fqdn)
    end

    def host_setting(host, setting)
      host.host_param(setting.to_s) || Setting[setting]
    end

    def ssh_password(_host) end

    def ssh_key_passphrase(_host) end

    def proxy_action_class
      ForemanRemoteExecutionCore::Actions::RunScript
    end
  end
end
