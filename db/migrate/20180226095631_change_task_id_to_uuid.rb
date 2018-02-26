class ChangeTaskIdToUuid < ActiveRecord::Migration[4.2]
  def up
    if on_postgresql?
      change_table :job_invocations do |t|
        t.change :task_id, :uuid, :using => 'task_id::uuid'
      end

      change_table :template_invocations do |t|
        t.change :run_host_job_task_id, :uuid, :using => 'run_host_job_task_id::uuid'
      end
    end
  end

  def down
    if on_postgresql?
      change_table :job_invocations do |t|
        t.change :task_id, :string, :limit => 255
      end

      change_table :template_invocations do |t|
        t.change :run_host_job_task_id, :string, :limit => 255
      end
    end
  end

  private

  def on_postgresql?
    ActiveRecord::Base.connection.adapter_name == 'PostgreSQL'
  end
end
