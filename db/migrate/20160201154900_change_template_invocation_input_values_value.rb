class ChangeTemplateInvocationInputValuesValue < ActiveRecord::Migration
  def change
    change_column :template_invocation_input_values, :value, :text
  end
end
