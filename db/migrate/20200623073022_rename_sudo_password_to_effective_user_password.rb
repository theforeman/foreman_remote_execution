class RenameSudoPasswordToEffectiveUserPassword < ActiveRecord::Migration[6.0]
  def change
    rename_column :job_invocations, :sudo_password, :effective_user_password
  end
end
