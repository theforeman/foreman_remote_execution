class AddPubKeyToSmartProxy < ActiveRecord::Migration[4.2]
  def change
    add_column :smart_proxies, :pubkey, :text
  end
end
