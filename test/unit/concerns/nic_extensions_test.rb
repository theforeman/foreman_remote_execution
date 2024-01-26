require 'test_plugin_helper'

class ForemanRemoteExecutionNicExtensionsTest < ActiveSupport::TestCase
  let(:host) { FactoryBot.create(:host) }

  it 'sets the first primary interface as the execution interface' do
    assert_equal host.interfaces.first, host.execution_interface
  end
end
