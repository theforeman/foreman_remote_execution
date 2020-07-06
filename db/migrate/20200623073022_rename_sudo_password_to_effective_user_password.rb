class RenameSudoPasswordToEffectiveUserPassword < ActiveRecord::Migration[6.0]
  def up
    rename_column :job_invocations, :sudo_password, :effective_user_password

    password = Setting.find_by(:name => 'remote_execution_sudo_password').value
    Setting.find_by(:name => 'remote_execution_effective_user_password').update(value: password)

    Setting.find_by(:name => 'remote_execution_sudo_password').delete
  end

  def down
    rename_column :job_invocations, :effective_user_password, :sudo_password

    password = Setting.find_by(:name => 'remote_execution_effective_user_password').value

    Setting.create!(name: 'remote_execution_sudo_password', value: password, description: 'Sudo password', category: 'Setting::RemoteExecution', settings_type: 'string', full_name: 'Sudo password',encrypted: true, default: nil)
    Setting.find_by(:name => 'remote_execution_effective_user_password').delete
  end
end
