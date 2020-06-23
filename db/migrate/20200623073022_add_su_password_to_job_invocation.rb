class AddSuPasswordToJobInvocation < ActiveRecord::Migration[6.0]
  def change
    add_column :job_invocations, :su_password, :string
  end
end
