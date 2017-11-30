class CreateTemplateInputSets < ActiveRecord::Migration[4.2]
  def change
    create_table :foreign_input_sets do |t|
      t.integer :template_id, :null => false
      t.integer :target_template_id, :null => false
      t.boolean :include_all, :null => false, :default => true
      t.text :include
      t.text :exclude
    end
    add_index :foreign_input_sets, :template_id
    add_foreign_key :foreign_input_sets, :templates

    add_index :foreign_input_sets, :target_template_id
    add_foreign_key :foreign_input_sets, :templates, :column => :target_template_id
  end
end
