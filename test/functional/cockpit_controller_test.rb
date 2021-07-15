require 'test_plugin_helper'

class CockpitControllerTest < ActionController::TestCase
  def setup
    as_admin do
      @host = FactoryBot.create(:host)
    end
  end

  test "should get host_ssh_params" do
    get :host_ssh_params, params: { id: @host.id }, session: set_session_user
    assert_response :success
    response = ActiveSupport::JSON.decode(@response.body)
    assert response.key?('ssh_user'), 'ssh_params response must include ssh_user'
  end
end
