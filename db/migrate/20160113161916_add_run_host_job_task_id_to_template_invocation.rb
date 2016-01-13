class AddRunHostJobTaskIdToTemplateInvocation < ActiveRecord::Migration
  def change
    add_column :template_invocations, :run_host_job_task_id, :string
    add_index :template_invocations, [:run_host_job_task_id], :name => 'template_invocations_run_host_job_task_id'
  end
end
