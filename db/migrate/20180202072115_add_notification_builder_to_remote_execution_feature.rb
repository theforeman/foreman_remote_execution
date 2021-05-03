class AddNotificationBuilderToRemoteExecutionFeature < ActiveRecord::Migration[4.2]
  def change
    add_column :remote_execution_features, :notification_builder, :string
  end
end
