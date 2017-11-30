class AddRunHostJobTaskIdToTemplateInvocation < ActiveRecord::Migration[4.2]
  def change
    add_column :template_invocations, :run_host_job_task_id, :string, :limit => 255
    add_index :template_invocations, [:run_host_job_task_id], :name => 'template_invocations_run_host_job_task_id'
  end
end
