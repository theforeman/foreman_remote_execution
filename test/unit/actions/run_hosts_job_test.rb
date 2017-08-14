
require 'test_plugin_helper'

module ForemanRemoteExecution
  class RunHostsJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    let(:host) { FactoryGirl.create(:host, :with_execution) }
    let(:proxy) { host.remote_execution_proxies('SSH')[:subnet].first }
    let(:targeting) { FactoryGirl.create(:targeting, :search_query => "name = #{host.name}", :user => User.current) }
    let(:job_invocation) do
      FactoryGirl.build(:job_invocation, :with_template).tap do |invocation|
        invocation.targeting = targeting
        invocation.description = 'Some short description'
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
      create_action(Actions::RemoteExecution::RunHostsJob).tap do |action|
        action.expects(:action_subject).with(job_invocation)
        ForemanTasks::Task::DynflowTask.stubs(:where).returns(mock.tap { |m| m.stubs(:first! => task) })
      end
    end
    let(:planned) do
      plan_action action, job_invocation
    end

    let(:delayed) do
      action.delay({ :start_at => Time.now.getlocal }, job_invocation)
      action
    end

    before do
      ProxyAPI::ForemanDynflow::DynflowProxy.any_instance.stubs(:tasks_count).returns(0)
      User.current = users :admin
      action
    end

    context 'targeting resolving' do
      it 'resolves dynamic targeting in plan' do
        targeting.targeting_type = 'dynamic_query'
        refute targeting.resolved?
        delayed
        refute targeting.resolved?
        planned
        targeting.hosts.must_include(host)
      end

      it 'resolves the hosts on static targeting in delay' do
        refute targeting.resolved?
        delayed
        targeting.hosts.must_include(host)
        # Verify Targeting#resolve_hosts! won't be hit again
        targeting.expects(:resolve_hosts!).never
        planned
      end

      it 'resolves the hosts on static targeting in plan phase if not resolved yet' do
        planned
        targeting.hosts.must_include(host)
      end
    end

    it 'triggers the RunHostJob actions on the resolved hosts in run phase' do
      planned.expects(:output).returns(:planned_count => 0)
      planned.expects(:trigger).with { |*args| args[0] == Actions::RemoteExecution::RunHostJob }
      planned.create_sub_plans
    end

    it 'uses the BindJobInvocation middleware' do
      planned
      job_invocation.task_id.must_equal '123'
    end

    # In plan phase this is handled by #action_subject
    #   which is expected in tests
    it 'sets input in delay phase when delayed' do
      delayed.input[:job_invocation]['id'].must_equal job_invocation.id
      delayed.input[:job_invocation]['name'].must_equal job_invocation.job_category
      delayed.input[:job_invocation]['description'].must_equal job_invocation.description
      planned # To make the expectations happy
    end

    describe 'concurrency control' do
      let(:level) { 5 }
      let(:span) { 60 }

      it 'can be disabled' do
        job_invocation.expects(:concurrency_level)
        job_invocation.expects(:time_span)
        action.expects(:limit_concurrency_level).never
        action.expects(:distribute_over_time).never
        planned
      end

      it 'can limit concurrency level' do
        job_invocation.expects(:concurrency_level).returns(level).twice
        job_invocation.expects(:time_span)
        action.expects(:limit_concurrency_level).with(level)
        action.expects(:distribute_over_time).never
        planned
      end

      it 'can distribute tasks over time' do
        job_invocation.expects(:time_span).returns(span).twice
        job_invocation.expects(:concurrency_level)
        action.expects(:distribute_over_time).with(span)
        action.expects(:distribute_over_time).never
        planned
      end

      it 'can use both' do
        job_invocation.expects(:time_span).returns(span).twice
        action.expects(:distribute_over_time).with(span)
        job_invocation.expects(:concurrency_level).returns(level).twice
        action.expects(:limit_concurrency_level).with(level)
        planned
      end
    end
  end
end
