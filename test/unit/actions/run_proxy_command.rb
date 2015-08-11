require "test_plugin_helper"

module ForemanRemoteExecution
  class RunProxyCommandTest <  ActiveSupport::TestCase
    include Dynflow::Testing

    let(:proxy) { FactoryGirl.build(:smart_proxy) }
    let(:hostname) { 'myhost.example.com' }
    let(:script) { 'ping -c 5 redhat.com' }
    let(:action) do
      create_and_plan_action(Actions::RemoteExecution::RunProxyCommand, proxy, hostname, script)
    end

    it 'plans for running the command action on server' do
      assert_run_phase action, { :hostname       => hostname,
                                 :script         => script,
                                 :proxy_url      => proxy.url,
                                 :effective_user => nil }
    end

    it 'sends to command to ssh provider' do
      action.proxy_action_name.must_equal 'Proxy::RemoteExecution::Ssh::CommandAction'
    end

    it "doesn't block on failure" do
      action.rescue_strategy.must_equal ::Dynflow::Action::Rescue::Skip
    end

  end
end
