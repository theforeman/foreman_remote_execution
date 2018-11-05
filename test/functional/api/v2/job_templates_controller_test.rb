require 'test_plugin_helper'

module Api
  module V2
    class JobTemplatesControllerTest < ActionController::TestCase
      setup do
        @template = FactoryBot.create :job_template
      end

      test 'should get index' do
        get :index
        templates = ActiveSupport::JSON.decode(@response.body)
        assert_not templates.empty?, 'Should response with template'
        assert_response :success
      end

      test 'should get templates of give organization' do
        @organization = FactoryBot.create(:organization)
        @template.organizations << @organization
        @template.save!
        get :index, params: { :organization_id => @organization.id }
        templates = ActiveSupport::JSON.decode(@response.body)
        assert_not templates.empty?, 'Should respond with template'
        assert_response :success
      end

      test 'should get template detail' do
        get :show, params: { :id => @template.to_param }
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        assert_not template.empty?
        assert_equal template['name'], @template.name
        refute_nil template['created_at']
        refute_nil template['updated_at']
      end

      test 'should create valid' do
        JobTemplate.any_instance.stubs(:valid?).returns(true)
        valid_attrs = { :template => 'This is a test template', :name => 'RandomName', :provider_type => 'ssh' }
        post :create, params: { :job_template => valid_attrs }
        template = ActiveSupport::JSON.decode(@response.body)
        assert template['name'] == 'RandomName'
        assert_response :success
      end

      test 'should not create invalid' do
        post :create
        assert_response :unprocessable_entity
      end

      test 'should update valid' do
        JobTemplate.any_instance.stubs(:valid?).returns(true)
        put :update, params: { :id => @template.to_param, :job_template => { :template => 'blah' } }
        assert_response :ok
      end

      test 'should not update invalid' do
        put :update, params: { :id => @template.to_param, :job_template => { :name => '' } }
        assert_response :unprocessable_entity
      end

      test 'should update effective user' do
        template = { name: @template.name, job_category: @template.job_category,
                     template: @template.template, provider_type: 'SSH',
                     effective_user_attributes: {
                       value: 'nobody',
                       overridable: true,
                       current_user: false,
                     } }
        put :update, params: { id: @template.to_param, job_template: template }
        assert_response :ok
      end

      test 'should destroy' do
        delete :destroy, params: { :id => @template.to_param }
        assert_response :ok
        refute JobTemplate.exists?(@template.id)
      end

      test 'should clone template' do
        post :clone, params: { :id => @template.to_param, :job_template => {:name => 'MyClone'} }
        assert_response :success
        template = ActiveSupport::JSON.decode(@response.body)
        assert_equal(template['name'], 'MyClone')
        assert_equal(template['template'], @template.template)
      end

      test 'clone name should not be blank' do
        post :clone, params: { :id => @template.to_param, :job_template => {:name => ''} }
        assert_response :unprocessable_entity
      end

      test 'should export template' do
        get :export, params: { :id => @template.to_param }
        User.current = users(:admin)
        assert_equal @response.body, @template.to_erb
        assert_response :success
      end

      test 'should import template' do
        new_name = @template.name = "#{@template.name}_renamed"
        erb_data = @template.to_erb
        post :import, params: { :template => erb_data }
        assert_response :success
        assert JobTemplate.unscoped.find_by(name: new_name)
      end
    end

  end
end
