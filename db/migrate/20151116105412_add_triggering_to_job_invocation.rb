class AddTriggeringToJobInvocation < ActiveRecord::Migration[4.2]
  def up
    add_column :job_invocations, :triggering_id, :integer, :index => true
    add_foreign_key :job_invocations, :foreman_tasks_triggerings, :column => :triggering_id
  end

  def down
    remove_column :job_invocations, :triggering_id
  end
end
