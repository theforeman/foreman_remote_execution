class RenameSudoPasswordToEffectiveUserPassword < ActiveRecord::Migration[6.0]
  def up
    rename_column :job_invocations, :sudo_password, :effective_user_password

    Parameter.where("name = 'remote_execution_sudo_password'").update_all(name: 'remote_execution_effective_user_password')

    return unless (password = Setting.find_by(:name => 'remote_execution_sudo_password').try(:value))

    Setting.find_by(:name => 'remote_execution_effective_user_password').update(value: password)

    Setting.find_by(:name => 'remote_execution_sudo_password').delete
  end

  def down
    rename_column :job_invocations, :effective_user_password, :sudo_password

    Parameter.where("name = 'remote_execution_effective_user_password'").update_all(name: 'remote_execution_sudo_password')

    return unless (password = Setting.find_by(:name => 'remote_execution_effective_user_password').try(:value))

    Setting.create!(name: 'remote_execution_sudo_password', value: password, description: 'Sudo password', category: 'Setting::RemoteExecution', settings_type: 'string', full_name: 'Sudo password',encrypted: true, default: nil)
    Setting.find_by(:name => 'remote_execution_effective_user_password').delete
  end
end
