class CreateTemplateInput < ActiveRecord::Migration
  def change
    create_table :template_inputs do |t|
      t.string :name, :null => false, :limit => 255
      t.boolean :required, :null => false, :default => false
      t.string :input_type, :null => false, :limit => 255
      t.string :fact_name, :limit => 255
      t.string :variable_name, :limit => 255
      t.string :puppet_class_name, :limit => 255
      t.string :puppet_parameter_name, :limit => 255
      t.text :description
      t.integer :template_id

      t.timestamps
    end

    add_foreign_key :template_inputs, :templates, :name => 'templates_template_id_fk', :column => 'template_id'
  end
end
