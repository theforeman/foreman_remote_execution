class Setting::RemoteExecution < Setting

  ::Setting::BLANK_ATTRS.concat %w{remote_execution_ssh_password remote_execution_ssh_key_passphrase remote_execution_sudo_password remote_execution_effective_user_password remote_execution_cockpit_url remote_execution_form_job_template}

  def self.default_settings
    [
      self.set('remote_execution_fallback_proxy',
        N_('Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy'),
        false,
        N_('Fallback to Any Proxy')),
      self.set('remote_execution_global_proxy',
        N_('Search for remote execution proxy outside of the proxies assigned to the host. ' +
        "The search will be limited to the host's organization and location."),
        true,
        N_('Enable Global Proxy')),
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
      self.set('remote_execution_effective_user_password', N_("Effective user password"), '', N_("Effective user password"), nil, {:encrypted => true}),
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
        'It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. '\
        'For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting'),
        false,
        N_('Connect by IP')),
      self.set('remote_execution_connect_by_ip_prefer_ipv6',
        N_('When connecting using ip address, should the IPv6 addresses be preferred? '\
        'If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. '\
        'By default and for compatibility, IPv4 will be preferred over IPv6 by default'),
        false,
        N_('Prefer IPv6 over IPv4')),
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
        N_('Cleanup working directories')),
      self.set('remote_execution_cockpit_url',
        N_('Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.'),
        nil,
        N_('Cockpit URL'),
        nil),
      self.set('remote_execution_form_job_template',
        N_('Choose a job template that is pre-selected in job invocation form'),
        'Run Command - SSH Default',
        N_('Form Job Template'),
        nil,
        { :collection => proc { Hash[JobTemplate.unscoped.map { |template| [template.name, template.name] }] } }),
      self.set('remote_execution_job_invocation_report_template',
        N_('Select a report template used for generating a report for a particular remote execution job'),
        'Jobs - Invocation report template',
        N_('Job Invocation Report Template'),
        nil,
        { :collection => proc { self.job_invocation_report_templates_select } }),
    ]
  end

  def self.job_invocation_report_templates_select
    Hash[ReportTemplate.unscoped.joins(:template_inputs).where(template_inputs: TemplateInput.where(name: 'job_id')).map { |template| [template.name, template.name] }]
  end
end
