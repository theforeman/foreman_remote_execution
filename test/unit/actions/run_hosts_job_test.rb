
require "test_plugin_helper"

module ForemanRemoteExecution
  class RunHostsJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    let(:host) { FactoryGirl.create(:host, :with_execution) }
    let(:proxy) { host.remote_execution_proxies('Ssh')[:subnet].first }
    let(:targeting) { FactoryGirl.create(:targeting, :search_query => "name = #{host.name}", :user => User.current) }
    let(:job_invocation) do
      FactoryGirl.build(:job_invocation, :with_template).tap do |invocation|
        invocation.targeting = targeting
        invocation.save
      end
    end

    let(:task) do
      OpenStruct.new(:id => '123').tap do |o|
        o.stubs(:add_missing_task_groups)
        o.stubs(:task_groups).returns([])
      end
    end
    let(:action) do
      action = create_action(Actions::RemoteExecution::RunHostsJob)
      action.expects(:action_subject).with(job_invocation)
      ForemanTasks::Task::DynflowTask.stubs(:where).returns(mock.tap { |m| m.stubs(:first! => task) })
      plan_action(action, job_invocation)
    end

    before do
      ProxyAPI::ForemanDynflow::DynflowProxy.any_instance.stubs(:tasks_count).returns(0)
      User.current = users :admin
      action
    end

    it 'resolves the hosts on targeting in plan phase' do
      targeting.hosts.must_include(host)
    end

    it 'triggers the RunHostJob actions on the resolved hosts in run phase' do
      template_invocation = job_invocation.template_invocation_for_host(host)
      action.expects(:trigger).with(Actions::RemoteExecution::RunHostJob, job_invocation, host, template_invocation, proxy)
      action.create_sub_plans
    end

    it 'uses the BindJobInvocation middleware' do
      action
      job_invocation.task_id.must_equal '123'
    end
  end
end
