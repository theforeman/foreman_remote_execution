# frozen_string_literal: true

require 'test_plugin_helper'

class JobTemplatesControllerTest < ActionController::TestCase
  context '#preview' do
    let(:template) { FactoryBot.create(:job_template) }
    let(:host) { FactoryBot.create(:host, :managed) }

    test 'should render a preview version of a template' do
      post :preview, params: { job_template: template.to_param, template: 'uptime' }, session: set_session_user
      assert_response :success
    end

    test 'should render a preview version of a template for a specific host' do
      post :preview, params: {
        job_template: template.to_param,
        template: '<%= @host.name %>',
        preview_host_id: host.id,
      }, session: set_session_user
      assert_response :success
      assert_equal host.name, @response.body
    end

    test 'should render a error message when template has errors' do
      InputTemplateRenderer.any_instance.stubs(:render).returns(false)
      post :preview, params: { job_template: template.to_param }, session: set_session_user
      assert_response :not_acceptable
    end
  end
end
