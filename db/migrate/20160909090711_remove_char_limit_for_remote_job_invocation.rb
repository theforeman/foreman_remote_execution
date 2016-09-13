class RemoveCharLimitForRemoteJobInvocation < ActiveRecord::Migration
  def up
    change_column :template_invocation_input_values, :value, :string, :null => false, :limit => nil
    change_column :job_invocations, :description, :string, :limit => nil
  end
  def down
    change_column :template_invocation_input_values, :value, :string, :null => false, :limit => 255
    change_column :job_invocations, :description, :string, :limit => 255
  end
end
