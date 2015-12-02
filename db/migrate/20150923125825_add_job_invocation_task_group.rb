class AddJobInvocationTaskGroup < ActiveRecord::Migration
  def up
    add_column :job_invocations, :task_group_id, :integer, :index => true
    add_foreign_key :job_invocations, :foreman_tasks_task_groups, :column => :task_group_id
  end

  def down
    remove_column :job_invocations, :task_group_id
  end
end
