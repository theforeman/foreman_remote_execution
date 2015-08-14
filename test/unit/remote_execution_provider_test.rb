require 'test_plugin_helper'

describe RemoteExecutionProvider do
  describe '.providers' do
    let(:providers) { RemoteExecutionProvider.providers }
    it { providers.must_be_kind_of HashWithIndifferentAccess }
    it 'makes providers accessible using symbol' do
      providers[:Ssh].must_equal SSHExecutionProvider
    end
    it 'makes providers accessible using string' do
      providers['Ssh'].must_equal SSHExecutionProvider
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
      RemoteExecutionProvider.provider_for(:Ssh).must_equal SSHExecutionProvider
    end

    it 'accepts strings' do
      RemoteExecutionProvider.provider_for('Ssh').must_equal SSHExecutionProvider
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

      it { provider_names.must_include 'Ssh' }
      it { provider_names.must_include 'Custom' }
    end
  end
end
