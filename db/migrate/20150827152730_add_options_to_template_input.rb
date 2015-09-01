class AddOptionsToTemplateInput < ActiveRecord::Migration
  def change
    add_column :template_inputs, :options, :text
  end
end
