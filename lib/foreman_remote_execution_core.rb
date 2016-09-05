require 'foreman_tasks_core'

module ForemanRemoteExecutionCore
  extend ForemanTasksCore::SettingsLoader
  register_settings([:remote_execution_ssh, :smart_proxy_remote_execution_ssh_core],
                    :ssh_identity_key_file => '~/.ssh/id_rsa_foreman_proxy',
                    :ssh_user              => 'root',
                    :remote_working_dir    => '/var/tmp',
                    :local_working_dir     => '/var/tmp')

  if ForemanTasksCore.dynflow_present?
    require 'foreman_tasks_core/runner'
    require 'foreman_remote_execution_core/script_runner'
    require 'foreman_remote_execution_core/actions'
  end

  require 'foreman_remote_execution_core/version'
end
