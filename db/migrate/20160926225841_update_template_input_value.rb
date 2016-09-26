class UpdateTemplateInputValue < ActiveRecord::Migration
  def change
    change_column :template_invocation_input_values, :value, :text, :limit => 16.megabytes - 1
  end
end
