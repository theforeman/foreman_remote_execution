class AddTargeting < ActiveRecord::Migration[4.2]
  def change
    create_table :targetings do |t|
      t.string :search_query, :limit => 255
      t.references :bookmark
      t.references :user
      t.string :targeting_type, :null => false, :limit => 255
      t.timestamps :null => true
    end

    add_index :targetings, [:bookmark_id], :name => 'targetings_bookmark_id'
    add_index :targetings, [:user_id], :name => 'targetings_user_id'
    add_foreign_key :targetings, :bookmarks, :name => 'targetings_bookmark_id', :column => 'bookmark_id'
    add_foreign_key :targetings, :users, :name => 'targetings_user_id', :column => 'user_id'

    create_table :targeting_hosts do |t|
      t.references :host, :null => false
      t.references :targeting, :null => false
    end

    add_index :targeting_hosts, [:host_id, :targeting_id], :name => 'targeting_hosts_host_targeting_ids'
    add_foreign_key :targeting_hosts, :hosts, :name => 'targeting_hosts_host_id', :column => 'host_id'
    add_foreign_key :targeting_hosts, :targetings, :name => 'targeting_hosts_targeting_id', :column => 'targeting_id'
  end
end
