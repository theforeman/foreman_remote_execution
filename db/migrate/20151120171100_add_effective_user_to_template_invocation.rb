class AddEffectiveUserToTemplateInvocation < ActiveRecord::Migration
  def change
    add_column :template_invocations, :effective_user, :string
  end
end
