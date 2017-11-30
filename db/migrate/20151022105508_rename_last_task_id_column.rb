class RenameLastTaskIdColumn < ActiveRecord::Migration[4.2]
  def change
    rename_column :job_invocations, :last_task_id, :task_id
    rename_index :job_invocations, 'job_invocations_last_task_id', 'job_invocations_task_id'
  end
end
