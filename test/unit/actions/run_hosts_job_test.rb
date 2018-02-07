
require 'test_plugin_helper'

module ForemanRemoteExecution
  class RunHostsJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    let(:host) { FactoryBot.create(:host, :with_execution) }
    let(:proxy) { host.remote_execution_proxies('SSH')[:subnet].first }
    let(:targeting) { FactoryBot.create(:targeting, :search_query => "name = #{host.name}", :user => User.current) }
    let(:job_invocation) do
      FactoryBot.build(:job_invocation, :with_template).tap do |invocation|
        invocation.targeting = targeting
        invocation.description = 'Some short description'
        invocation.password = 'changeme'
        invocation.key_passphrase = 'changemetoo'
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
      job_invocation_hash = delayed.input[:job_invocation]
      job_invocation_hash['id'].must_equal job_invocation.id
      job_invocation_hash['name'].must_equal job_invocation.job_category
      job_invocation_hash['description'].must_equal job_invocation.description
      planned # To make the expectations happy
    end

    describe 'concurrency control' do
      let(:level) { 5 }
      let(:span) { 60 }

      it 'can be disabled' do
        job_invocation.expects(:concurrency_level)
        job_invocation.expects(:time_span)
        planned.input.key?(:concurrency_control).must_equal false
      end

      it 'can limit concurrency level' do
        job_invocation.expects(:concurrency_level).returns(level).twice
        job_invocation.expects(:time_span)
        planned.input[:concurrency_control][:level].wont_be_empty
        planned.input[:concurrency_control].key?(:time).must_equal false
      end

      it 'can distribute tasks over time' do
        job_invocation.expects(:time_span).returns(span).twice
        job_invocation.expects(:concurrency_level)
        planned.input[:concurrency_control][:time].wont_be_empty
        planned.input[:concurrency_control].key?(:level).must_equal false
      end

      it 'can use both' do
        job_invocation.expects(:time_span).returns(span).twice
        job_invocation.expects(:concurrency_level).returns(level).twice
        planned.input[:concurrency_control][:time].wont_be_empty
        planned.input[:concurrency_control][:level].wont_be_empty
      end
    end

    describe 'notifications' do
      it 'creates notification on sucess run' do
        FactoryBot.create(:notification_blueprint, :name => 'rex_job_succeeded')
        assert_difference 'NotificationRecipient.where(:user_id => targeting.user.id).count' do
          finalize_action planned
        end
      end
    end
  end
end
