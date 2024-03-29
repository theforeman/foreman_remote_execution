require 'test_plugin_helper'

class ForemanRemoteExecutionForemanTasksCleanerExtensionsTest < ActiveSupport::TestCase
  # Apply the same stubbing as in foreman-tasks
  before do
    # To stop dynflow from backing up actions, execution_plans and steps
    ForemanTasks.dynflow.world.persistence.adapter.stubs(:backup_to_csv)
    ForemanTasks::Cleaner.any_instance.stubs(:say) # Make the tests silent
    # Hack to make the tests pass due to ActiveRecord shenanigans
    ForemanTasks::Cleaner.any_instance.stubs(:delete_orphaned_dynflow_tasks)
  end

  it 'tries to delete associated job invocations' do
    job = FactoryBot.create(:job_invocation, :with_task)
    ForemanTasks::Cleaner.new(:filter => "id = #{job.task.id}").delete
    assert_empty JobInvocation.where(:id => job.id)
  end

  it 'removes orphaned job invocations' do
    job = FactoryBot.create(:job_invocation, :with_task)
    assert_equal 1, JobInvocation.where(:id => job.id).count
    job.task.delete
    job.reload
    assert_nil job.task
    refute_nil job.task_id
    ForemanTasks::Cleaner.new(:filter => '').delete
    assert_empty JobInvocation.where(:id => job.id)
  end
end
