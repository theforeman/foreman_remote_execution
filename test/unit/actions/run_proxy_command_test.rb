require "test_plugin_helper"

module ForemanRemoteExecution
  class RunProxyCommandTest < ActiveSupport::TestCase
    include Dynflow::Testing

    let(:host) { FactoryGirl.build(:host, :with_execution) }
    let(:proxy) { host.remote_execution_proxies('Ssh')[:subnet].first }
    let(:hostname) { 'myhost.example.com' }
    let(:script) { 'ping -c 5 redhat.com' }
    let(:connection_options) { { 'retry_interval' => 15, 'retry_count' => 4, 'timeout' => 60 } }
    let(:action) do
      create_and_plan_action(Actions::RemoteExecution::RunProxyCommand, proxy, host.name, script)
    end

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

  end
end
