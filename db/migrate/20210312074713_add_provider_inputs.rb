class AddProviderInputs < ActiveRecord::Migration[6.0]
  def change
    create_table :invocation_provider_input_values do |t|
      t.references :template_invocation, :null => false, :index => { :name => 'idx_inv_provider_input_values_on_templ_inv_id' }
      t.string :value, :null => false, :limit => 255
      t.string :name, :null => false, :limit => 255
      t.timestamps
    end
  end
end
