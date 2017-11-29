class AddSecretsToJobInvocations < ActiveRecord::Migration
  def change
    add_column :job_invocations, :password, :string
    add_column :job_invocations, :key_passphrase, :string
  end
end
