class AddHostActionButtonToRemoteExecutionFeature < ActiveRecord::Migration
  def change
    add_column :remote_execution_features, :host_action_button, :boolean, :null => false, :default => false
  end
end
