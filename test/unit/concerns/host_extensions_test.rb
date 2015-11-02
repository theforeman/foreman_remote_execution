require 'test_plugin_helper'

describe ForemanRemoteExecution::HostExtensions do
  let(:provider) { 'Ssh' }

  before do
    User.current = FactoryGirl.build(:user, :admin)
  end

  after { User.current = nil }

  context 'ssh user' do
    let(:host) { FactoryGirl.build(:host, :with_execution) }
    let(:sshkey) { 'ssh-rsa AAAAB3NzaC1yc2EAAAABJQ foo@example.com' }

    before do
      SmartProxy.any_instance.stubs(:pubkey).returns(sshkey)
      Setting[:remote_execution_ssh_user] = 'root'
    end

    it 'has ssh user in the parameters' do
      host.params['remote_execution_ssh_user'].must_equal Setting[:remote_execution_ssh_user]
    end

    it 'can override ssh user' do
      host.host_parameters << FactoryGirl.build(:host_parameter, :name => 'remote_execution_ssh_user', :value => 'amy')
      host.params['remote_execution_ssh_user'].must_equal 'amy'
    end
  end

  context 'ssh keys' do
    let(:host) { FactoryGirl.build(:host, :with_execution) }
    let(:sshkey) { 'ssh-rsa AAAAB3NzaC1yc2EAAAABJQ foo@example.com' }

    it 'has ssh keys in the parameters' do
      SmartProxy.any_instance.stubs(:pubkey).returns(sshkey)
      host.remote_execution_ssh_keys.must_include sshkey
    end
  end

  context 'host has multiple nics' do
    let(:host) { FactoryGirl.build(:host, :with_execution) }

    it 'should only have one execution interface' do
      host.interfaces << FactoryGirl.build(:nic_managed)
      host.interfaces.each { |interface| interface.execution = true }
      host.wont_be :valid?
    end

    it 'returns the execution interface' do
      host.execution_interface.must_be_kind_of Nic::Managed
    end
  end

  describe 'proxy determination strategies' do
    context 'subnet strategy' do
      let(:host) { FactoryGirl.build(:host, :with_execution) }
      it { host.remote_execution_proxies(provider)[:subnet].must_include host.subnet.remote_execution_proxies.first }
    end

    context 'fallback strategy' do
      let(:host) { FactoryGirl.build(:host, :with_puppet) }

      context 'enabled' do
        before do
          Setting[:remote_execution_fallback_proxy] = true
          host.puppet_proxy.features << FactoryGirl.create(:feature, :ssh)
        end

        it 'returns a fallback proxy' do
          host.remote_execution_proxies(provider)[:fallback].must_include host.puppet_proxy
        end
      end

      context 'disabled' do
        before do
          Setting[:remote_execution_fallback_proxy] = false
          host.puppet_proxy.features << FactoryGirl.create(:feature, :ssh)
        end

        it 'returns no proxy' do
          host.remote_execution_proxies(provider)[:fallback].must_be_empty
        end
      end
    end

    context 'global strategy' do
      let(:organization) { FactoryGirl.build(:organization) }
      let(:location) { FactoryGirl.build(:location) }
      let(:host) { FactoryGirl.build(:host, :organization => organization, :location => location) }
      let(:proxy_in_taxonomies) { FactoryGirl.create(:smart_proxy, :ssh, :organizations => [organization], :locations => [location]) }
      let(:proxy_no_taxonomies) { FactoryGirl.create(:smart_proxy, :ssh) }

      context 'enabled' do
        before { Setting[:remote_execution_global_proxy] = true }

        it 'returns correct proxies confined by taxonomies' do
          proxy_in_taxonomies
          proxy_no_taxonomies
          host.remote_execution_proxies(provider)[:global].must_include proxy_in_taxonomies
          host.remote_execution_proxies(provider)[:global].wont_include proxy_no_taxonomies
        end

        it 'returns all proxies when there\'s no taxonomies' do
          Taxonomy.stubs(:enabled_taxonomies).returns([])
          host.remote_execution_proxies(provider)[:global].must_include proxy_in_taxonomies
          host.remote_execution_proxies(provider)[:global].must_include proxy_no_taxonomies
        end
      end

      context 'disabled' do
        before { Setting[:remote_execution_global_proxy] = false }
        it 'returns no proxy' do
          host.remote_execution_proxies(provider)[:global].must_be_empty
        end
      end
    end
  end
end
