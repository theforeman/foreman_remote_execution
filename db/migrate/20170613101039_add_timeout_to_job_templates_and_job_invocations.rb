class AddTimeoutToJobTemplatesAndJobInvocations < ActiveRecord::Migration
  def change
    add_column :templates, :timeout_interval, :integer
    add_column :job_invocations, :timeout_interval, :integer
  end
end
