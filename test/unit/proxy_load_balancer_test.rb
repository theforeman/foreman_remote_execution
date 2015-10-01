require 'test_plugin_helper'

describe ProxyLoadBalancer do
  let(:load_balancer) { ProxyLoadBalancer.new }

  before do
    ProxyAPI::ForemanDynflow::DynflowProxy.any_instance.stubs(:tasks_count).returns(0)
  end

  it 'load balances' do
    proxies = FactoryGirl.create_list(:smart_proxy, 3, :ssh)
    not_yet_seen = proxies.dup

    3.times do
      found = load_balancer.next(proxies)
      not_yet_seen.delete(found)
    end

    not_yet_seen.must_be_empty
  end

  it 'returns nil for if no proxy is available' do
    load_balancer.next([]).must_be_nil
  end
end
