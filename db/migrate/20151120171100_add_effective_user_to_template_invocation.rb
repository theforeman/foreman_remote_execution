class AddEffectiveUserToTemplateInvocation < ActiveRecord::Migration[4.2]
  def change
    add_column :template_invocations, :effective_user, :string, :limit => 255
  end
end
