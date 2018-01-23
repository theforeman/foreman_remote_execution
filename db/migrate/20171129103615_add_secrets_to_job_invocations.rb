class AddSecretsToJobInvocations < ActiveRecord::Migration[4.2]
  def change
    add_column :job_invocations, :password, :string
    add_column :job_invocations, :key_passphrase, :string
  end
end
