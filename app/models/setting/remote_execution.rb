class Setting::RemoteExecution < Setting

  def self.load_defaults
    # Check the table exists
    return unless super

    self.transaction do
      [
        self.set('remote_execution_fallback_proxy',
                 N_('Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy'),
                 false),
        self.set('remote_execution_global_proxy',
                 N_('Search for remote execution proxy outside of the proxies assigned to the host. ' +
                 "If locations or organizations are enabled, the search will be limited to the host's " +
                 'organization or location.'),
                 true),
        self.set('remote_execution_without_proxy',
                 N_('When enabled, the remote execution will try to run the commands directly, when no
                     proxy with remote execution feature is configured for the host.'),
                 false),
        self.set('remote_execution_ssh_user',
                 N_('Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.'),
                 'root'),
        self.set('remote_execution_effective_user',
                 N_('Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.'),
                 'root'),
        self.set('remote_execution_effective_user_method',
                 N_('What command should be used to switch to the effective user. One of %s') % SSHExecutionProvider::EFFECTIVE_USER_METHODS.inspect,
                 'sudo',
                 'remote_execution_effective_user_method',
                 nil,
                 { :collection => Proc.new {Hash[SSHExecutionProvider::EFFECTIVE_USER_METHODS.map{|method| [method, method]}]} }),
        self.set('remote_execution_sync_templates',
                 N_('Whether we should sync templates from disk when running db:seed.'),
                 true)
      ].each { |s| self.create! s.update(:category => 'Setting::RemoteExecution') }
    end

    true
  end

end
