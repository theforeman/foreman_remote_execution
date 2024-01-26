require 'test_plugin_helper'

class RemoteExecutionProviderTest < ActiveSupport::TestCase
  describe '.providers' do
    let(:providers) { RemoteExecutionProvider.providers }
    it { assert_kind_of HashWithIndifferentAccess, providers }
    it 'makes providers accessible using symbol' do
      assert_equal SSHExecutionProvider, providers[:SSH]
      assert_equal ScriptExecutionProvider, providers[:script]
    end
    it 'makes providers accessible using string' do
      assert_equal SSHExecutionProvider, providers['SSH']
      assert_equal ScriptExecutionProvider, providers['script']
    end
  end

  describe '.register_provider' do
    before { RemoteExecutionProvider.providers.delete(:new) }
    let(:new_provider) { RemoteExecutionProvider.providers[:new] }
    it { assert_nil new_provider }

    context 'registers a provider under key :new' do
      before { RemoteExecutionProvider.register(:new, String) }
      it { assert_equal String, new_provider }
    end
  end

  describe '.provider_for' do
    it 'accepts symbols' do
      assert_equal SSHExecutionProvider, RemoteExecutionProvider.provider_for(:SSH)
    end

    it 'accepts strings' do
      assert_equal SSHExecutionProvider, RemoteExecutionProvider.provider_for('SSH')
    end

    it 'returns a default one if unknown value is provided' do
      assert_equal ScriptExecutionProvider, RemoteExecutionProvider.provider_for('WinRM')
    end
  end

  describe '.provider_names' do
    let(:provider_names) { RemoteExecutionProvider.provider_names }

    it 'returns only strings' do
      provider_names.each do |name|
        assert_kind_of String, name
      end
    end

    context 'provider is registetered under :custom symbol' do
      before { RemoteExecutionProvider.register(:Custom, String) }

      it { assert_includes provider_names, 'SSH' }
      it { assert_includes provider_names, 'Custom' }
    end
  end

  describe '.proxy_feature' do
    # rubocop:disable Naming/ConstantName
    it 'handles provider subclasses properly' do
      old = ::RemoteExecutionProvider

      class P2 < old
      end
      ::RemoteExecutionProvider = P2

      class CustomProvider < ::RemoteExecutionProvider
      end

      ::RemoteExecutionProvider.register('custom', CustomProvider)

      feature = CustomProvider.proxy_feature
      assert_equal 'custom', feature
    ensure
      ::RemoteExecutionProvider = old
    end
    # rubocop:enable Naming/ConstantName
  end

  describe '.provider_proxy_features' do
    it 'returns correct values' do
      RemoteExecutionProvider.stubs(:providers).returns(
        :SSH => SSHExecutionProvider,
        :script => ScriptExecutionProvider
      )

      features = RemoteExecutionProvider.provider_proxy_features
      assert_includes features, 'SSH'
      assert_includes features, 'Script'
      RemoteExecutionProvider.unstub(:providers)
    end

    it 'can deal with non-arrays' do
      provider = OpenStruct.new(proxy_feature: 'Testing')
      RemoteExecutionProvider.stubs(:providers).returns(:testing => provider)
      features = RemoteExecutionProvider.provider_proxy_features
      assert_includes features, 'Testing'
      RemoteExecutionProvider.unstub(:providers)
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

    let(:job_invocation) { FactoryBot.create(:job_invocation, :with_template) }
    let(:template_invocation) { job_invocation.pattern_template_invocations.first }
    let(:host) { FactoryBot.create(:host) }
    let(:proxy_options) { SSHExecutionProvider.proxy_command_options(template_invocation, host) }
    let(:secrets) { SSHExecutionProvider.secrets(host) }

    describe 'effective user' do
      it 'takes the effective user from value from the template invocation' do
        template_invocation.effective_user = 'my user'
        assert_equal 'my user', proxy_options[:effective_user]
      end
    end

    describe 'ssh user' do
      it 'uses the remote_execution_ssh_user on the host param' do
        host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_user', :value => 'my user')
        assert_equal 'my user', proxy_options[:ssh_user]
      end
    end

    describe 'effective user password' do
      it 'uses the remote_execution_effective_user_password on the host param' do
        host.params['remote_execution_effective_user_password'] = 'mypassword'
        host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_password', :value => 'mypassword')
        assert_nil proxy_options[:effective_user_password]
        assert_equal 'mypassword', secrets[:effective_user_password]
      end
    end

    describe 'sudo' do
      it 'uses the remote_execution_effective_user_method on the host param' do
        host.params['remote_execution_effective_user_method'] = 'sudo'
        method_param = FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_method', :value => 'sudo')
        host.host_parameters << method_param
        assert_equal 'sudo', proxy_options[:effective_user_method]
        method_param.update!(:value => 'su')
        host.clear_host_parameters_cache!
        proxy_options = SSHExecutionProvider.proxy_command_options(template_invocation, host)
        assert_equal 'su', proxy_options[:effective_user_method]
        method_param.update!(:value => 'dzdo')
        host.clear_host_parameters_cache!
        proxy_options = SSHExecutionProvider.proxy_command_options(template_invocation, host)
        assert_equal 'dzdo', proxy_options[:effective_user_method]
      end
    end

    describe 'ssh port from settings' do
      before do
        Setting[:remote_execution_ssh_port] = '66'
      end

      it 'has ssh port changed in settings and check return type' do
        assert_kind_of Integer, proxy_options[:ssh_port]
        assert_equal 66, proxy_options[:ssh_port]
      end
    end

    describe 'ssh port from params' do
      it 'takes ssh port number from params and check return type' do
        host.params['remote_execution_ssh_port'] = '30'
        host.host_parameters << FactoryBot.build(:host_parameter, :name => 'remote_execution_ssh_port', :value => '30')
        host.clear_host_parameters_cache!
        assert_kind_of Integer, proxy_options[:ssh_port]
        assert_equal 30, proxy_options[:ssh_port]
      end
    end

    describe 'cleanup working directories setting' do
      before do
        Setting[:remote_execution_cleanup_working_dirs] = false
      end

      it 'updates the value via settings' do
        refute proxy_options[:cleanup_working_dirs]
      end
    end

    describe 'cleanup working directories from parameters' do
      it 'takes the value from host parameters' do
        host.params['remote_execution_cleanup_working_dirs'] = 'false'
        host.host_parameters << FactoryBot.build(:host_parameter, :name => 'remote_execution_cleanup_working_dirs', :value => 'false')
        host.clear_host_parameters_cache!
        refute proxy_options[:cleanup_working_dirs]
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
        assert_equal 'somehost.somedomain.org', SSHExecutionProvider.find_ip_or_hostname(host)

        # execution wins if present
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :name => 'special.somedomain.org'))
        host.interfaces << execution_interface
        host.primary_interface.update(:execution => false)
        host.interfaces.each(&:save)
        host.reload
        assert_equal execution_interface.fqdn, SSHExecutionProvider.find_ip_or_hostname(host)
      end

      it 'gets ip from flagged interfaces' do
        host.host_params['remote_execution_connect_by_ip'] = true
        # no ip address set on relevant interface - fallback to fqdn
        assert_equal 'somehost.somedomain.org', SSHExecutionProvider.find_ip_or_hostname(host)

        # provision interface with ip while primary without
        provision_interface = FactoryBot.build(:nic_managed,
          flags.merge(:provision => true, :ip => '10.0.0.1'))
        host.interfaces << provision_interface
        host.primary_interface.update(:provision => false)
        host.interfaces.each(&:save)
        host.reload
        assert_equal provision_interface.ip, SSHExecutionProvider.find_ip_or_hostname(host)

        # both primary and provision interface have IPs: the primary wins
        host.primary_interface.update(:ip => '10.0.0.2', :execution => false)
        host.reload
        assert_equal host.primary_interface.ip, SSHExecutionProvider.find_ip_or_hostname(host)

        # there is an execution interface with IP: it wins
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :ip => '10.0.0.3'))
        host.interfaces << execution_interface
        host.primary_interface.update(:execution => false)
        host.interfaces.each(&:save)
        host.reload
        assert_equal execution_interface.ip, SSHExecutionProvider.find_ip_or_hostname(host)

        # there is an execution interface with both IPv6 and IPv4: IPv4 is being preferred over IPv6 by default
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :ip => '10.0.0.4', :ip6 => 'fd00::4'))
        host.interfaces = [execution_interface]
        host.interfaces.each(&:save)
        host.reload
        assert_equal execution_interface.ip, SSHExecutionProvider.find_ip_or_hostname(host)
      end

      it 'gets ipv6 from flagged interfaces with IPv6 preference' do
        host.host_params['remote_execution_connect_by_ip_prefer_ipv6'] = true
        host.host_params['remote_execution_connect_by_ip'] = true

        # there is an execution interface with both IPv6 and IPv4: IPv6 is being preferred over IPv4 by host parameter configuration
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :ip => '10.0.0.4', :ip6 => 'fd00::4'))
        host.interfaces = [execution_interface]
        host.interfaces.each(&:save)
        host.reload
        assert_equal execution_interface.ip6, SSHExecutionProvider.find_ip_or_hostname(host)
      end

      it 'gets ipv6 from flagged interfaces with IPv4 preference but without IPv4 address' do
        host.host_params['remote_execution_connect_by_ip_prefer_ipv6'] = false
        host.host_params['remote_execution_connect_by_ip'] = true

        # there is an execution interface with both IPv6 and IPv4: IPv6 is being preferred over IPv4 by host parameter configuration
        execution_interface = FactoryBot.build(:nic_managed,
          flags.merge(:execution => true, :ip => nil, :ip6 => 'fd00::4'))
        host.interfaces = [execution_interface]
        host.interfaces.each(&:save)
        host.reload
        assert_equal execution_interface.ip6, SSHExecutionProvider.find_ip_or_hostname(host)
      end
    end
  end
end
