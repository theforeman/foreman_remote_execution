require 'test_plugin_helper'

class Concerns::ForemanRemoteExecution::Api::V2::HostsControllerExtensionTest < ActionController::TestCase
  tests Api::V2::HostsController

  def setup
    Setting::RemoteExecution.load_defaults
    as_admin do
      @host = FactoryBot.create(:host)
    end
  end

  test "should get ssh_params" do
    get :ssh_params, params: { id: @host.id }
    assert_response :success
    response = ActiveSupport::JSON.decode(@response.body)
    assert response.key?('ssh_user'), 'ssh_params response must include ssh_user'
  end
end
