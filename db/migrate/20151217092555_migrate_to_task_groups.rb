class MigrateToTaskGroups < ActiveRecord::Migration[4.2]
  class FakeJobInvocation < ApplicationRecord
    self.table_name = 'job_invocations'
  end

  def up
    say 'Migrating from locks to task groups'
    FakeJobInvocation.where('task_group_id IS NULL AND task_id IS NOT NULL').find_each do |job_invocation|
      task_group = JobInvocationTaskGroup.new
      task_group.task_ids = [job_invocation.task_id]
      task_group.save!
      job_invocation.task_group_id = task_group.id
      job_invocation.save!
    end
  end
end
