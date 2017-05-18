class SSHExecutionProvider < RemoteExecutionProvider

  EFFECTIVE_USER_METHODS = %w[sudo su].freeze

  class << self
    def proxy_command_options(template_invocation, host)
      super.merge(:ssh_user => ssh_user(host),
                  :effective_user => effective_user(template_invocation),
                  :effective_user_method => effective_user_method(host),
                  :ssh_port => ssh_port(host),
                  :authentication_methods => authentication_methods(host))
    end

    def humanized_name
      _('SSH')
    end

    def supports_effective_user?
      true
    end

    def find_ip_or_hostname(host)
      interfaces = effective_interfaces(host)
      if host_setting(host, :remote_execution_connect_by_ip)
        ip_interface = interfaces.find { |i| i.ip.present? }
      end
      if ip_interface
        ip_interface.ip
      else
        fqdn_interface = interfaces.find { |i| i.fqdn.present? }
        if fqdn_interface
          fqdn_interface.fqdn
        else
          raise _('Could not find any suitable interface for execution')
        end
      end
    end

    private

    def ssh_user(host)
      host.params['remote_execution_ssh_user']
    end

    def ssh_port(host)
      Integer(host_setting(host, :remote_execution_ssh_port))
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

    def effective_interfaces(host)
      interfaces = []
      %w(execution primary provision).map do |flag|
        interfaces << host.send(flag + '_interface')
      end
      interfaces.compact.uniq
    end

    def host_setting(host, setting)
      host.params[setting.to_s] || Setting[setting]
    end

    def authentication_methods(host)
      arr = []
      arr << 'gssapi-with-mic' if host_setting(host, :remote_execution_kerberos_auth)
      arr << 'pubkey'
      arr
    end
  end
end
