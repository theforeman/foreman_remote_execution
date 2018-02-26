require 'test_plugin_helper'

class ForemanRemoteExecutionForemanTasksCleanerExtensionsTest < ActiveSupport::TestCase
  it 'tries to delete associated job invocations' do
    job = FactoryBot.create(:job_invocation, :with_task)
    ForemanTasks::Cleaner.new(:filter => "id = #{job.task.id}").delete
    JobInvocation.where(:id => job.id).must_be :empty?
  end

  it 'removes orphaned job invocations' do
    job = FactoryBot.create(:job_invocation, :with_task)
    JobInvocation.where(:id => job.id).count.must_equal 1
    job.task.delete
    job.reload
    job.task.must_be :nil?
    job.task_id.wont_be :nil?
    ForemanTasks::Cleaner.new(:filter => '').delete
    JobInvocation.where(:id => job.id).must_be :empty?
  end
end
