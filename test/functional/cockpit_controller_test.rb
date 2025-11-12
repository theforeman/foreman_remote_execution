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

  describe 'redirect action security tests' do
    setup do
      Setting[:foreman_url] = 'https://foreman.example.com'
      # Mock the cockpit URL
      ScriptExecutionProvider.stubs(:cockpit_url_for_host).returns('/cockpit')
    end

    test "should reject redirect without redirect_uri parameter" do
      get :redirect, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect with invalid URI" do
      get :redirect, params: { redirect_uri: 'not-a-valid-uri::' }, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect with javascript scheme" do
      get :redirect, params: { redirect_uri: 'javascript:alert("xss")' }, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect with data scheme" do
      get :redirect, params: { redirect_uri: 'data:text/html,<script>alert("xss")</script>' }, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect with ftp scheme" do
      get :redirect, params: { redirect_uri: 'ftp://evil.com/file' }, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect to wrong hostname" do
      get :redirect, params: { redirect_uri: 'https://evil.com/cockpit' }, session: set_session_user
      assert_response :bad_request
    end

    test "should reject redirect to subdomain attack" do
      get :redirect, params: { redirect_uri: 'https://evil.foreman.example.com/cockpit' }, session: set_session_user
      assert_response :bad_request
    end

    test "should allow redirect to valid cockpit URL" do
      valid_uri = 'https://foreman.example.com/cockpit/path'
      get :redirect, params: { redirect_uri: valid_uri }, session: set_session_user
      assert_response :redirect

      # Verify the redirect includes the access token
      location = response.location
      assert_includes location, 'access_token='
      assert_includes location, 'https://foreman.example.com/cockpit/path'
    end

    test "should allow redirect with http scheme to same hostname" do
      valid_uri = 'http://foreman.example.com/cockpit/path'
      get :redirect, params: { redirect_uri: valid_uri }, session: set_session_user
      assert_response :redirect
    end

    test "should handle case insensitive scheme validation" do
      get :redirect, params: { redirect_uri: 'HTTPS://foreman.example.com/cockpit' }, session: set_session_user
      assert_response :redirect
    end
  end
end
