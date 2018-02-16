class AddFeatureIdToJobInvocation < ActiveRecord::Migration[4.2]
  def change
    add_column :job_invocations, :remote_execution_feature_id, :integer, :index => true
    add_foreign_key :job_invocations, :remote_execution_features, :column => :remote_execution_feature_id
  end
end
