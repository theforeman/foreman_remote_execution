class CreateTargetRemoteExecutionProxies < ActiveRecord::Migration
  def change
    create_table :target_remote_execution_proxies do |t|
      t.integer :remote_execution_proxy_id
      t.integer :target_id
      t.string :target_type

      t.timestamps
    end

    add_index :target_remote_execution_proxies, :remote_execution_proxy_id, :name => 'target_remote_execution_proxies_proxy_id'
    add_index :target_remote_execution_proxies, [:target_id, :target_type], :name => 'target_remote_execution_proxies_target_id_target_type'
  end
end
