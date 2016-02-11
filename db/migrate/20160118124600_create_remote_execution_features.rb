class CreateRemoteExecutionFeatures < ActiveRecord::Migration
  def change
    create_table :remote_execution_features do |t|
      t.string :label, :index => true, :null => false
      t.string :name
      t.string :description
      t.text :provided_inputs, :null => true
      t.integer :template_id, :null => true
    end
    add_index :remote_execution_features, :label
    add_index :remote_execution_features, :template_id
    add_foreign_key :remote_execution_features, :templates
  end
end
