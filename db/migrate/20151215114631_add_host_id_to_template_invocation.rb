class AddHostIdToTemplateInvocation < ActiveRecord::Migration[4.2]
  class FakeTemplateInvocation < ApplicationRecord
    self.table_name = 'template_invocations'
  end

  def up
    add_column :template_invocations, :host_id, :integer
    add_foreign_key 'template_invocations', 'hosts', :name => 'template_invocations_hosts_id_fk', :column => 'host_id'
    FakeTemplateInvocation.reset_column_information

    say 'Migrating existing execution locks to explicit relations, this may take a while'
    FakeTemplateInvocation.all.each do |template_invocation|
      task = ForemanTasks::Task.for_action_types('Actions::RemoteExecution::RunHostJob').joins(:locks).where(
        :'foreman_tasks_locks.resource_type' => 'TemplateInvocation',
        :'foreman_tasks_locks.resource_id' => template_invocation.id
      ).first
      next if task.nil? # skip invocations from very early versions of remote executions

      host_id = task.locks.where(:'foreman_tasks_locks.resource_type' => 'Host::Managed').first.resource_id
      next unless Host.find_by(id: host_id)

      template_invocation.host_id = host_id
      template_invocation.save!
    end
  end

  def down
    remove_foreign_key 'template_invocations', :name => 'template_invocations_hosts_id_fk'
    remove_column :template_invocations, :host_id
  end
end
