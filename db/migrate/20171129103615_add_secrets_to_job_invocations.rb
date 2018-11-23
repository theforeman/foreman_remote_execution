class AddSecretsToJobInvocations < ActiveRecord::Migration[4.2]
  def change
    change_table :job_invocations, :bulk => true do |t|
      t.column :password, :string
      t.column :key_passphrase, :string
    end
  end
end
