require 'test_plugin_helper'

module Api
  module V2
    class JobInvocationsControllerTest < ActionController::TestCase
      setup do
        @invocation = FactoryGirl.create(:job_invocation, :with_template)
        @template = FactoryGirl.create(:job_template, :with_input)
      end

      test 'should get index' do
        get :index
        invocations = ActiveSupport::JSON.decode(@response.body)
        refute_empty invocations, 'Should response with invocation'
        assert_response :success
      end

      test 'should get invocation detail' do
        get :show, :id => @invocation.id
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        refute_empty template
        assert_equal template['job_name'], @invocation.job_name
      end

      test 'should create valid without job_template_id' do
        attrs = { :job_name => @template.job_name, :name => 'RandomName', :targeting_type => 'static_query', :search_query => 'foobar'}
        post :create, :job_invocation => attrs

        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal attrs[:job_name], invocation['job_name']
        assert_response :success
      end

      test 'should create valid with job_template_id' do
        attrs = { :job_name => @template.job_name, :name => 'RandomName', :job_template_id => @template.id,
                  :targeting_type => 'static_query', :search_query => 'foobar'}
        post :create, :job_invocation => attrs

        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal attrs[:job_name], invocation['job_name']
        assert_response :success
      end

      test 'should create with description format overridden' do
        attrs = { :job_name => @template.job_name, :name => 'RandomName', :job_template_id => @template.id,
                  :targeting_type => 'static_query', :search_query => 'foobar', :description_format => 'format' }
        post :create, :job_invocation => attrs

        invocation = ActiveSupport::JSON.decode(@response.body)
        assert_equal attrs[:description_format], invocation['description']
        assert_response :success
      end
    end
  end
end
