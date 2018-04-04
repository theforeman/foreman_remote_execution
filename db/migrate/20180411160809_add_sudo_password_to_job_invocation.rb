class AddSudoPasswordToJobInvocation < ActiveRecord::Migration[4.2]
  def change
    add_column :job_invocations, :sudo_password, :string
  end
end
