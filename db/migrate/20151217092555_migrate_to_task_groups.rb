class MigrateToTaskGroups < ActiveRecord::Migration
  class FakeJobInvocation < ActiveRecord::Base
    set_table_name 'job_invocations'
  end

  def up
    say 'Migrating from locks to task groups'
    FakeJobInvocation.where('task_group_id IS NULL AND task_id IS NOT NULL').each do |job_invocation|
      task_group = JobInvocationTaskGroup.new
      task_group.task_ids = [job_invocation.task_id]
      task_group.save!
      job_invocation.task_group_id = task_group.id
      job_invocation.save!
    end
  end
end
