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
    host.stubs(:skip_orchestration?).returns false
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).with(interface.ip)
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).with(host.name)

    host.build = true
    host.save!

    ids = ["ssh_remove_known_hosts_interface_#{interface.ip}_#{proxy.id}",
           "ssh_remove_known_hosts_host_#{host.name}_#{proxy.id}"]
    _(host.queue.task_ids).must_equal ids
    _(host.queue.items.map(&:status)).must_equal %w(completed completed)
  end

  it 'does not fail on 404 from the smart proxy' do
    host.stubs(:skip_orchestration?).returns false
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).raises(RestClient::ResourceNotFound).twice
    host.build = true
    host.save!
    ids = ["ssh_remove_known_hosts_interface_#{interface.ip}_#{proxy.id}",
           "ssh_remove_known_hosts_host_#{host.name}_#{proxy.id}"]
    _(host.queue.task_ids).must_equal ids
    _(host.queue.items.map(&:status)).must_equal %w(completed completed)
  end

  it 'does not trigger the removal when creating a new host' do
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).never
    host = Host::Managed.new(:name => 'test', :ip => '127.0.0.1')
    host.stubs(:skip_orchestration?).returns false
    _(host.queue.task_ids).must_equal []
  end

  it 'does not call to the proxy when target is nil' do
    host.stubs(:skip_orchestration?).returns false
    SmartProxy.any_instance.expects(:drop_host_from_known_hosts).with(host.name)
    host.interfaces.first.stubs(:ip)
    host.destroy
    _(host.queue.items.map(&:status)).must_equal %w(completed completed)
  end
end
