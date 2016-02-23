require 'test_plugin_helper'

module ForemanRemoteExecution
  module SSH
    class RunProxyCommandTest < ActiveSupport::TestCase
      include Dynflow::Testing

      let(:host) { FactoryGirl.build(:host, :with_execution) }
      let(:proxy) { host.remote_execution_proxies('SSH')[:subnet].first }
      let(:hostname) { 'myhost.example.com' }
      let(:script) { 'ping -c 5 redhat.com' }
      let(:connection_options) { { 'retry_interval' => 15, 'retry_count' => 4, 'timeout' => 60 } }
      let(:action) do
        create_and_plan_action(Actions::RemoteExecution::SSH::RunProxyCommand, proxy, host.name, script)
      end
      let(:timestamp) { 1_443_194_805.9192207 }

      it 'plans for running the command action on server' do
        assert_run_phase action, { :hostname       => host.name,
                                   :script         => script,
                                   :proxy_url      => proxy.url,
                                   :effective_user => nil,
                                   :connection_options => connection_options }
      end

      it 'sends to command to ssh provider' do
        action.proxy_action_name.must_equal 'Proxy::RemoteExecution::Ssh::CommandAction'
      end

      it "doesn't block on failure" do
        action.rescue_strategy.must_equal ::Dynflow::Action::Rescue::Skip
      end

      describe '#live_output' do
        let(:task) { ForemanTasks::Task.new }

        let(:action) do
          planned_action = create_and_plan_action(Actions::RemoteExecution::SSH::RunProxyCommand, proxy, hostname, script)
          create_action_presentation(Actions::RemoteExecution::SSH::RunProxyCommand).tap do |action|
            action.stubs(:task).returns(task)
            action.stubs(:proxy).returns(ProxyAPI::ForemanDynflow::DynflowProxy.new(:url => proxy.url))
            action.instance_variable_set('@input', planned_action.input)
            action.output.merge!(:proxy_task_id => '123')
          end
        end

        let(:live_output) do
          action.live_output
        end

        describe 'when the task is finished' do
          before do
            task.state = 'stopped'
            task.ended_at = Time.at(timestamp + 1).utc
          end

          describe 'the task finished sucessfully' do
            before do
              action.output.merge!(:proxy_output => { :result => [{ 'output_type' => 'stdout', 'output' => 'Hello', 'timestamp' => timestamp}],
                                                      :exit_status => 0 })
            end

            it "doesn't fetch data from proxy anymore" do
              action.proxy.expects(:status_of_task).never
              live_output.size.must_equal 2
              live_output[0]['output_type'].must_equal 'stdout'
              live_output[0]['output'].must_equal 'Hello'
              live_output[0]['timestamp'].must_be_kind_of Float
              live_output[1]['output_type'].must_equal 'stdout'
              live_output[1]['output'].must_equal 'Exit status: 0'
              live_output[1]['timestamp'].must_be_kind_of Float
            end
          end

          describe 'there was not output data from proxy' do
            before do
              action.output.merge!(:proxy_output => {})
            end

            it "doesn't fetch data from proxy anymore" do
              action.proxy.expects(:status_of_task).never
              live_output.size.must_equal 1
              live_output[0]['output_type'].must_equal 'debug'
              live_output[0]['output'].must_equal 'No output'
              live_output[0]['timestamp'].must_be_kind_of Float
            end
          end
        end

        describe 'when something went wrong while fetching the data' do
          before do
            action.proxy.expects(:status_of_task).raises('Something went wrong')
          end

          it 'reports the failure as part of the live output' do
            live_output.size.must_equal 1
            live_output.first['output_type'].must_equal 'debug'
            live_output.first['output'].must_equal 'Error loading data from proxy: RuntimeError - Something went wrong'
            live_output.first['timestamp'].must_be_kind_of Float
          end
        end

        describe 'when there was some connection error while running the command' do
          before do
            action.output.merge!(:proxy_task_id => nil,
                                 :metadata => { :failed_proxy_tasks => [action.send(:format_exception, RuntimeError.new('Connection error'))]})
          end

          it 'reports the failure as part of the live output' do
            live_output.size.must_equal 1
            live_output.first['output_type'].must_equal 'debug'
            live_output.first['output'].must_equal 'Initialization error: RuntimeError - Connection error'
            live_output.first['timestamp'].must_be_kind_of Float
          end
        end

        describe 'when proxy returns valid data' do
          before do
            action.proxy.expects(:status_of_task).returns('actions' =>
                                                          [{ 'class' => 'Proxy::RemoteExecution::Ssh::CommandAction',
                                                             'output' => { 'result' => [ { 'output_type' => 'stdout',
                                                                                           'output' => 'Hello',
                                                                                           'timestamp' => timestamp }]}}])
          end

          it 'reports the failure as part of the live output' do
            live_output.size.must_equal 1
            live_output.first['output_type'].must_equal 'stdout'
            live_output.first['output'].must_equal 'Hello'
            live_output.first['timestamp'].must_be_kind_of Float
          end
        end
      end
    end
  end
end
