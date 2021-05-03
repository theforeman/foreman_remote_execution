class AddProxySelectorOverrideToRemoteExecutionFeature < ActiveRecord::Migration[4.2]
  def change
    add_column :remote_execution_features, :proxy_selector_override, :string
  end
end
