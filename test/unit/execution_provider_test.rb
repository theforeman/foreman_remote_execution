require 'test_plugin_helper'

describe ExecutionProvider do
  test '.providers returns all registered providers with indifferent access' do
    ExecutionProvider.providers.must_be_kind_of HashWithIndifferentAccess
    ExecutionProvider.providers[:ssh].must_equal SSHExecutionProvider
    ExecutionProvider.providers['ssh'].must_equal SSHExecutionProvider
  end

  test '.register_provider registers a new provider' do
    ExecutionProvider.providers[:new].must_be_nil
    ExecutionProvider.register(:new, String)
    ExecutionProvider.providers[:new].must_equal String
  end

  test '.provider_for accepts both symbols and strings' do
    ExecutionProvider.provider_for(:ssh).must_equal SSHExecutionProvider
    ExecutionProvider.provider_for('ssh').must_equal SSHExecutionProvider
  end
end
