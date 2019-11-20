require 'test_plugin_helper'

class SSHOrchestrationTest < ActiveSupport::TestCase
  let(:host) { FactoryBot.create(:host, :managed, :with_subnet) }
  let(:proxy) { FactoryBot.create(:smart_proxy, :ssh) }
  let(:interface) { host.interfaces.first }

  before { interface.subnet.remote_execution_proxies = [proxy] }

  it 'attempts to drop IP address and hostname from smart proxies on destroy' do
    host.stubs(:skip_orchestration?).returns false
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).with(interface.ip)
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).with(host.name)
    host.destroy
  end

  it 'attempts to drop IP address and hostname from smart proxies on rebuild' do
    host.build = true
    host.save!
    ids = ["ssh_remove_known_hosts_interface_#{interface.ip}_#{proxy.id}",
           "ssh_remove_known_hosts_host_#{host.name}_#{proxy.id}"]
    _(host.queue.task_ids).must_equal ids
  end
end
