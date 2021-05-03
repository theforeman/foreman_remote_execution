class UpdateTemplateInputValue < ActiveRecord::Migration[4.2]
  def change
    change_column :template_invocation_input_values, :value, :text, :limit => 16.megabytes - 1
  end
end
