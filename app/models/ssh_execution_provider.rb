class SSHExecutionProvider < RemoteExecutionProvider
  class << self
    def proxy_command_options(template_invocation, host)
      super.merge(:ssh_user => ssh_user(host),
                  :effective_user => effective_user(template_invocation),
                  :effective_user_method => effective_user_method(host),
                  :ssh_port => ssh_port(host))
    end

    def humanized_name
      _('SSH')
    end

    def supports_effective_user?
      true
    end

    private

    def ssh_user(host)
      host.params['remote_execution_ssh_user']
    end

    def ssh_port(host)
      Integer(host_setting(host, :remote_execution_ssh_port))
    end

    def ssh_password(host)
      host_setting(host, :remote_execution_ssh_password)
    end

    def ssh_key_passphrase(host)
      host_setting(host, :remote_execution_ssh_key_passphrase)
    end
  end
end
