class AddPubKeyToSmartProxy < ActiveRecord::Migration
  def change
    add_column :smart_proxies, :pubkey, :text
  end
end
