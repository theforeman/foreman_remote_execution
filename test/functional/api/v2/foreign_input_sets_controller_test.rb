require 'test_plugin_helper'

module Api
  module V2
    class ForeignInputSetsControllerTest < ActionController::TestCase
      setup do
        @template = FactoryBot.create(:job_template)
        @foreign_template = FactoryBot.create(:job_template, :with_input)
        @new_foreign_template = FactoryBot.create(:job_template, :with_input)
        @input_set = @template.foreign_input_sets.create(:target_template_id => @foreign_template.id)
      end

      test 'should get index' do
        get :index, params: { :template_id => @template.id }
        input_sets = ActiveSupport::JSON.decode(@response.body)
        assert_not input_sets.empty?, 'Should respond with input sets'
        assert_response :success
      end

      test 'should get input set detail' do
        get :show, params: { :template_id => @template.to_param, :id => @input_set.to_param }
        assert_response :success
        input_set = ActiveSupport::JSON.decode(@response.body)
        assert_not input_set.empty?
        assert_equal input_set['target_template_name'], @foreign_template.name
      end

      test 'should create valid' do
        valid_attrs = { :target_template_id => @new_foreign_template.id }
        post :create, params: { :foreign_input_set => valid_attrs, :template_id => @template.to_param }
        input_set = ActiveSupport::JSON.decode(@response.body)
        assert_equal input_set['target_template_name'], @new_foreign_template.name
        assert_response :success
      end

      test 'should not create invalid' do
        post :create, params: { :template_id => @template.to_param }
        assert_response :unprocessable_entity
      end

      test 'should update valid' do
        put :update, params: { :template_id => @template.to_param, :id => @input_set.to_param, :foreign_input_set => { :include_all => false } }
        assert_response :ok
      end

      test 'should not update invalid' do
        put :update, params: { :template_id => @template.to_param, :id => @input_set.to_param, :foreign_input_set => { :target_template_id => '' } }
        assert_response :unprocessable_entity
      end

      test 'should destroy' do
        delete :destroy, params: { :template_id => @template.to_param, :id => @input_set.to_param }
        assert_response :ok
        assert_not ForeignInputSet.exists?(@input_set.id)
      end
    end
  end
end
