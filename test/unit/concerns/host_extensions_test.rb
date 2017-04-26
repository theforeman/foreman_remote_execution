require 'test_plugin_helper'

class ForemanRemoteExecutionHostExtensionsTest < ActiveSupport::TestCase
  before do
    Setting::RemoteExecution.load_defaults
  end
  let(:provider) { 'SSH' }

  before { User.current = FactoryGirl.build(:user, :admin) }
  after { User.current = nil }

  describe 'ssh specific params' do
    let(:host) { FactoryGirl.create(:host, :with_execution) }
    let(:sshkey) { 'ssh-rsa AAAAB3NzaC1yc2EAAAABJQ foo@example.com' }

    before do
      SmartProxy.any_instance.stubs(:pubkey).returns(sshkey)
      Setting[:remote_execution_ssh_user] = 'root'
      Setting[:remote_execution_effective_user_method] = 'sudo'
    end

    it 'has ssh user in the parameters' do
      host.params['remote_execution_ssh_user'].must_equal Setting[:remote_execution_ssh_user]
    end

    it 'can override ssh user' do
      host.host_parameters << FactoryGirl.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_user', :value => 'amy')
      host.params['remote_execution_ssh_user'].must_equal 'amy'
    end

    it 'has effective user method in the parameters' do
      host.params['remote_execution_effective_user_method'].must_equal Setting[:remote_execution_effective_user_method]
    end

    it 'can override effective user method' do
      host.host_parameters << FactoryGirl.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_method', :value => 'su')
      host.params['remote_execution_effective_user_method'].must_equal 'su'
    end

    it 'has ssh keys in the parameters' do
      host.remote_execution_ssh_keys.must_include sshkey
    end

    it 'has ssh keys in the parameters even when no user specified' do
      # this is a case, when using the helper in provisioning templates
      FactoryGirl.create(:smart_proxy, :ssh)
      host.interfaces.first.subnet.remote_execution_proxies.clear
      User.current = nil
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
      let(:tax_organization) { FactoryGirl.build(:organization) }
      let(:tax_location) { FactoryGirl.build(:location) }
      let(:host) { FactoryGirl.build(:host, :organization => tax_organization, :location => tax_location) }
      let(:proxy_in_taxonomies) { FactoryGirl.create(:smart_proxy, :ssh, :organizations => [tax_organization], :locations => [tax_location]) }
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
