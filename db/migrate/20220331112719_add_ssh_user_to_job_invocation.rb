class AddSshUserToJobInvocation < ActiveRecord::Migration[6.0]
  def change
    add_column :job_invocations, :ssh_user, :string
  end
end
