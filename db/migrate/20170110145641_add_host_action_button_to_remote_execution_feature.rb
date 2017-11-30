class AddHostActionButtonToRemoteExecutionFeature < ActiveRecord::Migration[4.2]
  def change
    add_column :remote_execution_features, :host_action_button, :boolean, :null => false, :default => false
  end
end
