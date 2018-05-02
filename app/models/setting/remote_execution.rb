class Setting::RemoteExecution < Setting

  ::Setting::BLANK_ATTRS.concat %w{remote_execution_ssh_password remote_execution_ssh_key_passphrase}

  # rubocop:disable Metrics/MethodLength,Metrics/AbcSize
  def self.load_defaults
    # Check the table exists
    return unless super

    # rubocop:disable Metrics/BlockLength
    self.transaction do
      [
        self.set('remote_execution_fallback_proxy',
                 N_('Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy'),
                 false,
                 N_('Fallback to Any Proxy')),
        self.set('remote_execution_global_proxy',
                 N_('Search for remote execution proxy outside of the proxies assigned to the host. ' +
                 "If locations or organizations are enabled, the search will be limited to the host's " +
                 'organization or location.'),
                 true,
                 N_('Enable Global Proxy')),
        self.set('remote_execution_without_proxy',
                 N_('When enabled, the remote execution will try to run the commands directly, when no
                     proxy with remote execution feature is configured for the host.'),
                 false,
                 N_('Fallback Without Proxy')),
        self.set('remote_execution_ssh_user',
                 N_('Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.'),
                 'root',
                 N_('SSH User')),
        self.set('remote_execution_effective_user',
                 N_('Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.'),
                 'root',
                 N_('Effective User')),
        self.set('remote_execution_effective_user_method',
                 N_('What command should be used to switch to the effective user. One of %s') % SSHExecutionProvider::EFFECTIVE_USER_METHODS.inspect,
                 'sudo',
                 N_('Effective User Method'),
                 nil,
                 { :collection => proc { Hash[SSHExecutionProvider::EFFECTIVE_USER_METHODS.map { |method| [method, method] }] } }),
        self.set('remote_execution_sync_templates',
                 N_('Whether we should sync templates from disk when running db:seed.'),
                 true,
                 N_('Sync Job Templates')),
        self.set('remote_execution_ssh_port',
                 N_('Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.'),
                 '22',
                 N_('SSH Port')),
        self.set('remote_execution_connect_by_ip',
                 N_('Should the ip addresses on host interfaces be preferred over the fqdn? '\
                 'It is useful, when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip.'),
                 false,
                 N_('Connect by IP')),
        self.set('remote_execution_ssh_password',
                 N_('Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password'),
                 nil,
                 N_('Default SSH password'),
                 nil,
                 { :encrypted => true }),
        self.set('remote_execution_ssh_key_passphrase',
                 N_('Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase'),
                 nil,
                 N_('Default SSH key passphrase'),
                 nil,
                 { :encrypted => true }),
        self.set('remote_execution_workers_pool_size',
                 N_('Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.'),
                 5,
                 N_('Workers pool size')),
        self.set('remote_execution_cleanup_working_dirs',
                 N_('When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.'),
                 true,
                 N_('Cleanup working directories'))
      ].each { |s| self.create! s.update(:category => 'Setting::RemoteExecution') }
    end

    true
  end
  # rubocop:enable AbcSize
  # rubocop:enable Metrics/MethodLength,Metrics/AbcSize
end
