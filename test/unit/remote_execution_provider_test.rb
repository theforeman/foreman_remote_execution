require 'test_plugin_helper'

describe RemoteExecutionProvider do
  describe '.providers' do
    let(:providers) { RemoteExecutionProvider.providers }
    it { providers.must_be_kind_of HashWithIndifferentAccess }
    it 'makes providers accessible using symbol' do
      providers[:SSH].must_equal SSHExecutionProvider
    end
    it 'makes providers accessible using string' do
      providers['SSH'].must_equal SSHExecutionProvider
    end
  end

  describe '.register_provider' do
    let(:new_provider) { RemoteExecutionProvider.providers[:new] }
    it { new_provider.must_be_nil }

    context 'registers a provider under key :new' do
      before { RemoteExecutionProvider.register(:new, String) }
      it { new_provider.must_equal String }
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
        name.must_be_kind_of String
      end
    end

    context 'provider is registetered under :custom symbol' do
      before { RemoteExecutionProvider.register(:Custom, String) }

      it { provider_names.must_include 'SSH' }
      it { provider_names.must_include 'Custom' }
    end
  end

  describe SSHExecutionProvider do
    before { User.current = FactoryGirl.build(:user, :admin) }
    after { User.current = nil }

    before do
      Setting::RemoteExecution.load_defaults
    end

    let(:job_invocation) { FactoryGirl.create(:job_invocation, :with_template) }
    let(:template_invocation) { job_invocation.pattern_template_invocations.first }
    let(:host) { FactoryGirl.create(:host) }
    let(:proxy_options) { SSHExecutionProvider.proxy_command_options(template_invocation, host) }

    describe 'effective user' do
      it 'takes the effective user from value from the template invocation' do
        template_invocation.effective_user = 'my user'
        proxy_options[:effective_user].must_equal 'my user'
      end
    end

    describe 'ssh user' do
      it 'uses the remote_execution_ssh_user on the host param' do
        host.params['remote_execution_ssh_user'] = 'my user'
        host.host_parameters << FactoryGirl.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_user', :value => 'my user')
        proxy_options[:ssh_user].must_equal 'my user'
      end
    end

    describe 'sudo' do
      it 'uses the remote_execution_ssh_user on the host param' do
        host.params['remote_execution_effective_user_method'] = 'sudo'
        method_param = FactoryGirl.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_method', :value => 'sudo')
        host.host_parameters << method_param
        proxy_options[:effective_user_method].must_equal 'sudo'
        method_param.update_attributes!(:value => 'su')
        host.clear_host_parameters_cache!
        proxy_options = SSHExecutionProvider.proxy_command_options(template_invocation, host)
        proxy_options[:effective_user_method].must_equal 'su'
      end
    end
  end
end
