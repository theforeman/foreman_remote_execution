require 'test_plugin_helper'

describe ProxyLoadBalancer do
  let(:load_balancer) { ProxyLoadBalancer.new }

  before do
    ProxyAPI::ForemanDynflow::DynflowProxy.any_instance.stubs(:tasks_count).returns(0)
  end

  it 'load balances' do
    count = 3
    ProxyAPI::ForemanDynflow::DynflowProxy.any_instance.expects(:tasks_count).raises.then.times(count - 1).returns(0)
    proxies = FactoryGirl.create_list(:smart_proxy, count, :ssh)

    available = proxies.reduce([]) do |found, _|
      found << load_balancer.next(proxies)
    end

    available.count.must_equal count
    available.uniq.count.must_equal count - 1
    load_balancer.offline.count.must_equal 1
  end

  it 'returns nil for if no proxy is available' do
    load_balancer.next([]).must_be_nil
  end
end
