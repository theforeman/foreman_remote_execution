class AddLastTaskIdToJobInvocation < ActiveRecord::Migration
  def change
    add_column :job_invocations, :last_task_id, :string
    add_index :job_invocations, [:last_task_id], :name => 'job_invocations_last_task_id'
  end
end
