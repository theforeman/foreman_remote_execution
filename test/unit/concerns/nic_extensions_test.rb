require 'test_plugin_helper'

class ForemanRemoteExecutionNicExtensionsTest < ActiveSupport::TestCase
  let(:host) { FactoryGirl.create(:host) }

  it 'sets the first primary interface as the execution interface' do
    host.execution_interface.must_equal host.interfaces.first
  end
end
