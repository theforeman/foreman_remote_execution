class AddTimeoutToJobTemplatesAndJobInvocations < ActiveRecord::Migration
  def change
    add_column :templates, :execution_timeout_interval, :integer
    add_column :job_invocations, :execution_timeout_interval, :integer
  end
end
