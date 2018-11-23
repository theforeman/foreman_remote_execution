require 'test_plugin_helper'

module Api
  module V2
    class RemoteExecutionFeaturesControllerTest < ActionController::TestCase
      setup do
        @remote_execution_feature = RemoteExecutionFeature.register(:my_awesome_feature, 'My awesome feature',
                                                                    :description => 'You will not believe what it does',
                                                                    :provided_inputs => ['awesomeness_level'])
        @template = FactoryBot.create(:job_template, :with_input)
      end

      test 'should get index' do
        get :index
        remote_execution_features = ActiveSupport::JSON.decode(@response.body)
        assert_not remote_execution_features.empty?, 'Should respond with input sets'
        assert_response :success
      end

      test 'should get input set detail' do
        get :show, params: { :id => @remote_execution_feature.to_param }
        assert_response :success
        remote_execution_feature = ActiveSupport::JSON.decode(@response.body)
        assert_not remote_execution_feature.empty?
        assert_equal remote_execution_feature['name'], @remote_execution_feature.name
      end

      test 'should update valid' do
        put :update, params: { :id => @remote_execution_feature.to_param, :job_template_id => @template.id }
        assert_response :ok
      end
    end
  end
end
