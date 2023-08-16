require 'test_plugin_helper'
require 'securerandom'

module ForemanRemoteExecution
  class RunHostsJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    # Adding run_step_id wich is needed in RunHostsJob as a quick fix
    # it will be added to dynflow in the future see https://github.com/Dynflow/dynflow/pull/391
    # rubocop:disable Style/ClassAndModuleChildren
    class Dynflow::Testing::DummyPlannedAction
      def run_step_id
        Dynflow::Testing.get_id
      end
    end
    # rubocop:enable Style/ClassAndModuleChildren

    let(:host) { FactoryBot.create(:host, :with_execution) }
    let(:proxy) { host.remote_execution_proxies('SSH')[:subnet].first }
    let(:targeting) { FactoryBot.create(:targeting, :search_query => "name = #{host.name}", :user => User.current) }
    let(:job_invocation) do
      FactoryBot.build(:job_invocation, :with_template).tap do |invocation|
        invocation.targeting = targeting
        invocation.description = 'Some short description'
        invocation.password = 'changeme'
        invocation.key_passphrase = 'changemetoo'
        invocation.effective_user_password = 'sudopassword'
        invocation.save
      end
    end

    let(:uuid) { SecureRandom.uuid }
    let(:task) do
      OpenStruct.new(:id => uuid).tap do |o|
        o.stubs(:add_missing_task_groups)
        o.stubs(:task_groups).returns([])
        o.stubs(:pending?).returns(true)
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
        assert_not targeting.resolved?
        delayed
        assert_not targeting.resolved?
        planned
        _(targeting.hosts).must_include(host)
      end

      it 'resolves the hosts on static targeting in delay' do
        assert_not targeting.resolved?
        delayed
        _(targeting.hosts).must_include(host)
        # Verify Targeting#resolve_hosts! won't be hit again
        targeting.expects(:resolve_hosts!).never
        planned
      end

      it 'resolves the hosts on static targeting in plan phase if not resolved yet' do
        planned
        _(targeting.hosts).must_include(host)
      end
    end

    it 'triggers the RunHostJob actions on the resolved hosts in run phase' do
      planned.expects(:output).at_most(5).returns(:planned_count => 0)
      planned.expects(:trigger).with { |*args| args[0] == Actions::RemoteExecution::RunHostJob }
      planned.create_sub_plans
    end

    it 'uses the BindJobInvocation middleware' do
      planned
      _(job_invocation.task_id).must_equal uuid
    end

    # In plan phase this is handled by #action_subject
    #   which is expected in tests
    it 'sets input in delay phase when delayed' do
      job_invocation_hash = delayed.input[:job_invocation]
      _(job_invocation_hash['id']).must_equal job_invocation.id
      _(job_invocation_hash['name']).must_equal job_invocation.job_category
      _(job_invocation_hash['description']).must_equal job_invocation.description
      planned # To make the expectations happy
    end

    describe '#proxy_batch_size' do
      it 'defaults to Setting[foreman_tasks_proxy_batch_size]' do
        Setting.expects(:[]).with('foreman_tasks_proxy_batch_size').returns(14)
        planned
        _(planned.proxy_batch_size).must_equal 14
      end

      it 'gets the provider value' do
        provider = mock('provider')
        provider.expects(:proxy_batch_size).returns(15)
        JobTemplate.any_instance.expects(:provider).returns(provider)

        _(planned.proxy_batch_size).must_equal 15
      end
    end

    describe 'concurrency control' do
      let(:level) { 5 }
      let(:span) { 60 }

      it 'can be disabled' do
        job_invocation.expects(:concurrency_level)
        _(planned.input.key?(:concurrency_control)).must_equal false
      end

      it 'can limit concurrency level' do
        job_invocation.expects(:concurrency_level).returns(level).twice
        planned.input[:concurrency_control][:level].wont_be_empty
        planned.input[:concurrency_control].key?(:time).must_equal false
      end
    end

    describe 'notifications' do
      it 'creates drawer notification on succeess' do
        blueprint = planned.job_invocation.build_notification
        blueprint.expects(:deliver!)
        planned.job_invocation.expects(:build_notification).returns(blueprint)
        planned.notify_on_success(nil)
      end

      it 'creates drawer notification on failure' do
        blueprint = planned.job_invocation.build_notification
        blueprint.expects(:deliver!)
        planned.job_invocation.expects(:build_notification).returns(blueprint)
        planned.notify_on_failure(nil)
      end

      describe 'ignoring drawer notification' do
        before do
          blueprint = planned.job_invocation.build_notification
          blueprint.expects(:deliver!)
          planned.job_invocation.expects(:build_notification).returns(blueprint)
        end

        let(:mail) do
          object = mock
          object.stubs(:deliver_now)
          object
        end

        describe 'for user subscribed to all' do
          before do
            planned.expects(:mail_notification_preference).returns(UserMailNotification.new(:interval => RexMailNotification::ALL_JOBS))
          end

          it 'sends the mail notification on success' do
            RexJobMailer.expects(:job_finished).returns(mail)
            planned.notify_on_success(nil)
          end

          it 'sends the mail notification on failure' do
            RexJobMailer.expects(:job_finished).returns(mail)
            planned.notify_on_failure(nil)
          end
        end

        describe 'for user subscribed to failures' do
          before do
            planned.expects(:mail_notification_preference).returns(UserMailNotification.new(:interval => RexMailNotification::FAILED_JOBS))
          end

          it 'it does not send the mail notification on success' do
            RexJobMailer.expects(:job_finished).never
            planned.notify_on_success(nil)
          end

          it 'sends the mail notification on failure' do
            RexJobMailer.expects(:job_finished).returns(mail)
            planned.notify_on_failure(nil)
          end
        end

        describe 'for user subscribed to successful jobs' do
          before do
            planned.expects(:mail_notification_preference).returns(UserMailNotification.new(:interval => RexMailNotification::SUCCEEDED_JOBS))
          end

          it 'sends the mail notification on success' do
            RexJobMailer.expects(:job_finished).returns(mail)
            planned.notify_on_success(nil)
          end

          it 'does not send the mail notification on failure' do
            RexJobMailer.expects(:job_finished).never
            planned.notify_on_failure(nil)
          end
        end
      end
    end
  end
end
