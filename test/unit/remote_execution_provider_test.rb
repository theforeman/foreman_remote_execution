require 'test_plugin_helper'

class RemoteExecutionProviderTest < ActiveSupport::TestCase
  describe '.providers' do
    let(:providers) { RemoteExecutionProvider.providers }
    it { _(providers).must_be_kind_of HashWithIndifferentAccess }
    it 'makes providers accessible using symbol' do
      _(providers[:SSH]).must_equal SSHExecutionProvider
    end
    it 'makes providers accessible using string' do
      _(providers['SSH']).must_equal SSHExecutionProvider
    end
  end

  describe '.register_provider' do
    before { RemoteExecutionProvider.providers.delete(:new) }
    let(:new_provider) { RemoteExecutionProvider.providers[:new] }
    it { _(new_provider).must_be_nil }

    context 'registers a provider under key :new' do
      before { RemoteExecutionProvider.register(:new, String) }
      it { _(new_provider).must_equal String }
    end
  end

  describe '.provider_for' do
    it 'accepts symbols' do
      RemoteExecutionProvider.provider_for(:SSH).must_equal SSHExecutionProvider
    end

    it 'accepts strings' do
      RemoteExecutionProvider.provider_for('SSH').must_equal SSHExecutionProvider
    end
  end

  describe '.provider_names' do
    let(:provider_names) { RemoteExecutionProvider.provider_names }

    it 'returns only strings' do
      provider_names.each do |name|
        _(name).must_be_kind_of String
      end
    end

    context 'provider is registetered under :custom symbol' do
      before { RemoteExecutionProvider.register(:Custom, String) }

      it { _(provider_names).must_include 'SSH' }
      it { _(provider_names).must_include 'Custom' }
    end
  end

  describe '.host_setting' do
    let(:host) { FactoryBot.create(:host) }

    it 'honors falsey values set as a host parameter' do
      key = 'remote_execution_connect_by_ip'
      Setting[key] = true
      host.parameters << HostParameter.new(name: key, value: false)

      refute RemoteExecutionProvider.host_setting(host, key)
    end
  end

  describe SSHExecutionProvider do
    before { User.current = FactoryBot.build(:user, :admin) }
    after { User.current = nil }

    before do
      Setting::RemoteExecution.load_defaults
    end

    let(:job_invocation) { FactoryBot.create(:job_invocation, :with_template) }
    let(:template_invocation) { job_invocation.pattern_template_invocations.first }
    let(:host) { FactoryBot.create(:host) }
    let(:proxy_options) { SSHExecutionProvider.proxy_command_options(template_invocation, host) }
    let(:secrets) { SSHExecutionProvider.secrets(host) }

    describe 'effective user' do
      it 'takes the effective user from value from the template invocation' do
        template_invocation.effective_user = 'my user'
        _(proxy_options[:effective_user]).must_equal 'my user'
      end
    end

    describe 'ssh user' do
      it 'uses the remote_execution_ssh_user on the host param' do
        host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_user', :value => 'my user')
        _(proxy_options[:ssh_user]).must_equal 'my user'
      end
    end

    describe 'effective user password' do
      it 'uses the remote_execution_effective_user_password on the host param' do
        host.params['remote_execution_effective_user_password'] = 'mypassword'
        host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_password', :value => 'mypassword')
        assert_not proxy_options.key?(:effective_user_password)
        _(secrets[:effective_user_password]).must_equal 'mypassword'
      end
    end

    describe 'sudo' do
      it 'uses the remote_execution_effective_user_method on the host param' do
        host.params['remote_execution_effective_user_method'] = 'sudo'
        method_param = FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_method', :value => 'sudo')
        host.host_parameters << method_param
        _(proxy_options[:effective_user_method]).must_equal 'sudo'
        method_param.update!(:value => 'su')
        host.clear_host_parameters_cache!
        proxy_options = SSHExecutionProvider.proxy_command_options(template_invocation, host)
        _(proxy_options[:effective_user_method]).must_equal 'su'
        method_param.update!(:value => 'dzdo')
        host.clear_host_parameters_cache!
        proxy_options = SSHExecutionProvider.proxy_command_options(template_invocation, host)
        _(proxy_options[:effective_user_method]).must_equal 'dzdo'
      end
    end

    describe 'ssh port from settings' do
      before do
        Setting[:remote_execution_ssh_port] = '66'
      end

      it 'has ssh port changed in settings and check return type' do
        _(proxy_options[:ssh_port]).must_be_kind_of Integer
        _(proxy_options[:ssh_port]).must_equal 66
      end
    end

    describe 'ssh port from params' do
      it 'takes ssh port number from params and check return type' do
        host.params['remote_execution_ssh_port'] = '30'
        host.host_parameters << FactoryBot.build(:host_parameter, :name => 'remote_execution_ssh_port', :value => '30')
        host.clear_host_parameters_cache!
        _(proxy_options[:ssh_port]).must_be_kind_of Integer
        _(proxy_options[:ssh_port]).must_equal 30
      end
    end

    describe 'cleanup working directories setting' do
      before do
        Setting[:remote_execution_cleanup_working_dirs] = false
      end

      it 'updates the value via settings' do
        _(proxy_options[:cleanup_working_dirs]).must_equal false
      end
    end

    describe 'cleanup working directories from parameters' do
      it 'takes the value from host parameters' do
        host.params['remote_execution_cleanup_working_dirs'] = 'false'
        host.host_parameters << FactoryBot.build(:host_parameter, :name => 'remote_execution_cleanup_working_dirs', :value => 'false')
        host.clear_host_parameters_cache!
        _(proxy_options[:cleanup_working_dirs]).must_equal false
      end
    end

    describe '#find_ip_or_hostname' do
      let(:host) do
        FactoryBot.create(:host) do |host|
          host.interfaces = [FactoryBot.build(:nic_managed, flags.merge(:ip => nil, :name => 'somehost.somedomain.org', :primary => true)),
                             FactoryBot.build(:nic_managed, flags.merge(:ip => '127.0.0.1'))]
        end.reload
        # Reassigning the interfaces triggers the on-deletion ssh key removal for the interface which is being replaced
        # This has an undesired side effect of caching the original interface as execution one which made the tests
        # give wrong results. Reloading the host wipes the cache
      end

      let(:flags) do
        { :primary => false, :provision => false, :execution => false }
      end

      it 'gets fqdn from flagged interfaces if not preferring ips' do
        # falling to primary interface
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal 'somehost.somedomain.org'

        # execution wins if present
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :name => 'special.somedomain.org'))
        host.interfaces << execution_interface
        host.primary_interface.update(:execution => false)
        host.interfaces.each(&:save)
        host.reload
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal execution_interface.fqdn
      end

      it 'gets ip from flagged interfaces' do
        host.host_params['remote_execution_connect_by_ip'] = true
        # no ip address set on relevant interface - fallback to fqdn
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal 'somehost.somedomain.org'

        # provision interface with ip while primary without
        provision_interface = FactoryBot.build(:nic_managed,
          flags.merge(:provision => true, :ip => '10.0.0.1'))
        host.interfaces << provision_interface
        host.primary_interface.update(:provision => false)
        host.interfaces.each(&:save)
        host.reload
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal provision_interface.ip

        # both primary and provision interface have IPs: the primary wins
        host.primary_interface.update(:ip => '10.0.0.2', :execution => false)
        host.reload
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal host.primary_interface.ip

        # there is an execution interface with IP: it wins
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :ip => '10.0.0.3'))
        host.interfaces << execution_interface
        host.primary_interface.update(:execution => false)
        host.interfaces.each(&:save)
        host.reload
        SSHExecutionProvider.find_ip_or_hostname(host).must_equal execution_interface.ip
      end
    end
  end
end
