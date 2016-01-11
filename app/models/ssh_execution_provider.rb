class SSHExecutionProvider < RemoteExecutionProvider

  EFFECTIVE_USER_METHODS = %w[sudo su]

  class << self
    def proxy_command_options(template_invocation, host)
      super.merge(:ssh_user => ssh_user(host),
                  :effective_user => effective_user(template_invocation),
                  :effective_user_method => effective_user_method(host))
    end

    def humanized_name
      _("SSH")
    end

    def supports_effective_user?
      true
    end

    private

    def ssh_user(host)
      host.params['remote_execution_ssh_user']
    end

    def effective_user(template_invocation)
      template_invocation.effective_user
    end

    def effective_user_method(host)
      method = host.params['remote_execution_effective_user_method'] || Setting[:remote_execution_effective_user_method]
      unless EFFECTIVE_USER_METHODS.include?(method)
        raise _('Effective user method "%{current_value}" is not one of %{valid_methods}') %
                  { :current_value => method, :valid_methods => EFFECTIVE_USER_METHODS}
      end
      method
    end
  end
end
