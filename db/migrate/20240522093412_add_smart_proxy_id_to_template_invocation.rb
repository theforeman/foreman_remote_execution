class AddSmartProxyIdToTemplateInvocation < ActiveRecord::Migration[6.0]
  def change
    change_table :template_invocations do |t|
      t.references :smart_proxy, foreign_key: true
    end
  end
end
