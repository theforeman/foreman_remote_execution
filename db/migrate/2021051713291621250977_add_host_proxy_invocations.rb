class AddHostProxyInvocations < ActiveRecord::Migration[6.0]
  def change
    # rubocop:disable Rails/CreateTableWithTimestamps
    create_table :host_proxy_invocations do |t|
      t.references :host, :null => false
      t.references :smart_proxy, :null => false
    end
    # rubocop:enable Rails/CreateTableWithTimestamps

    add_index :host_proxy_invocations, [:host_id, :smart_proxy_id], unique: true
  end
end
