class ScriptExecutionProvider < RemoteExecutionProvider
  class << self
    def proxy_command_options(template_invocation, host)
      super.merge(:ssh_user => ssh_user(host),
        :effective_user => effective_user(template_invocation),
        :effective_user_method => effective_user_method(host),
        :cleanup_working_dirs => cleanup_working_dirs?(host),
        :ssh_port => ssh_port(host))
    end

    def humanized_name
      _('Script')
    end

    def supports_effective_user?
      true
    end

    def ssh_password(host)
      host_setting(host, :remote_execution_ssh_password)
    end

    def ssh_key_passphrase(host)
      host_setting(host, :remote_execution_ssh_key_passphrase)
    end

    def proxy_operation_name
      'ssh'
    end

    def secrets(host)
      {
        :ssh_password => ssh_password(host),
        :key_passphrase => ssh_key_passphrase(host),
        :effective_user_password => effective_user_password(host),
      }
    end

    def ssh_params(host)
      proxy = proxy_for_cockpit(host)
      {
        :hostname => find_ip_or_hostname(host),
        :proxy => proxy.class == Symbol ? proxy : proxy.url,
        :ssh_user => ssh_user(host),
        :ssh_port => ssh_port(host),
        :ssh_password => ssh_password(host),
        :ssh_key_passphrase => ssh_key_passphrase(host),
      }
    end

    def cockpit_url_for_host(host)
      Setting[:remote_execution_cockpit_url] % { :host => host } if Setting[:remote_execution_cockpit_url].present?
    end

    def proxy_feature
      %w(SSH Script)
    end

    private

    def ssh_user(host)
      host.host_param('remote_execution_ssh_user')
    end

    def ssh_port(host)
      Integer(host_setting(host, :remote_execution_ssh_port))
    end

    def proxy_for_cockpit(host)
      proxy_selector = ::RemoteExecutionProxySelector.new
      proxy = proxy_selector.determine_proxy(host, 'Script', capability: 'cockpit')
      return proxy unless [:not_defined, :not_available, nil].include?(proxy)

      proxy_selector.determine_proxy(host, 'SSH')
    end
  end
end

SSHExecutionProvider = ScriptExecutionProvider
