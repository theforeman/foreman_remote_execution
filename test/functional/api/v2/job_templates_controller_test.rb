require 'test_plugin_helper'

module Api
  module V2
    class JobTemplatesControllerTest < ActionController::TestCase
      setup do
        @template = FactoryGirl.create :job_template
      end

      test "should get index" do
        get :index
        templates = ActiveSupport::JSON.decode(@response.body)
        assert !templates.empty?, "Should response with template"
        assert_response :success
      end

      test "should get template detail" do
        get :show,  :id => @template.to_param
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        assert !template.empty?
        assert_equal template["name"], @template.name
      end

      test "should create valid" do
        JobTemplate.any_instance.stubs(:valid?).returns(true)
        valid_attrs = { :template => "This is a test template", :name => "RandomName", :provider_type => 'ssh' }
        post :create,  :job_template => valid_attrs
        template = ActiveSupport::JSON.decode(@response.body)
        assert template["name"] == "RandomName"
        assert_response 200
      end

      test "should not create invalid" do
        post :create
        assert_response :unprocessable_entity
      end

      test "should update valid" do
        JobTemplate.any_instance.stubs(:valid?).returns(true)
        put :update,  :id => @template.to_param,
                      :job_template => { :template => "blah" }
        assert_response :ok
      end

      test "should not update invalid" do
        put :update,  :id => @template.to_param,
                      :job_template => { :name => "" }
        assert_response :unprocessable_entity
      end

      test "should destroy" do
        delete :destroy,  :id => @template.to_param
        assert_response :ok
        refute JobTemplate.exists?(@template.id)
      end

      test 'should clone template' do
        post :clone,  :id => @template.to_param,
                      :job_template => {:name => 'MyClone'}
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        assert_equal(template['name'], 'MyClone')
        assert_equal(template['template'], @template.template)
      end

      test 'clone name should not be blank' do
        post :clone,  :id => @template.to_param,
                      :job_template => {:name => ''}
        assert_response :unprocessable_entity
      end
    end
  end
end
