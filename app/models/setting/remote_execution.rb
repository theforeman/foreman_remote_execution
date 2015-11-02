class Setting::RemoteExecution < Setting

  def self.load_defaults
    # Check the table exists
    return unless super

    self.transaction do
      [
        self.set('remote_execution_fallback_proxy',
                 N_("Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy"),
                 false),
        self.set('remote_execution_global_proxy',
                 N_("Search for remote execution proxy outside of the proxies assigned to the host. " +
                 "If locations or organizations are enabled, the search will be limited to the host's " +
                 "organization or location."),
                 true),
        self.set('remote_execution_ssh_user',
                 N_("Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user."),
                 'root'),
      ].each { |s| self.create! s.update(:category => "Setting::RemoteExecution") }
    end

    true
  end

end
