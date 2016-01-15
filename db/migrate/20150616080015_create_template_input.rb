class CreateTemplateInput < ActiveRecord::Migration
  def change
    create_table :template_inputs do |t|
      t.string :name, :null => false
      t.boolean :required, :null => false, :default => false
      t.string :input_type, :null => false
      t.string :fact_name
      t.string :variable_name
      t.string :puppet_class_name
      t.string :puppet_parameter_name
      t.text :description
      t.integer :template_id

      t.timestamps
    end

    add_foreign_key :template_inputs, :templates, :name => 'templates_template_id_fk', :column => 'template_id'
  end
end
