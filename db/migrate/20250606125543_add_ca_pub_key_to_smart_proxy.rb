class AddCAPubKeyToSmartProxy < ActiveRecord::Migration[7.0]
  def change
    add_column :smart_proxies, :ca_pubkey, :text
  end
end
