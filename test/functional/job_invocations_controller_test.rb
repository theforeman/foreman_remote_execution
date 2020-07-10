# frozen_string_literal: true

require 'test_plugin_helper'
require_relative '../support/remote_execution_helper'

class JobInvocationsControllerTest < ActionController::TestCase
  test 'should parse inputs coming from the URL params' do
    template = FactoryBot.create(:job_template, :with_input)
    feature = FactoryBot.create(:remote_execution_feature,
      :job_template => template)
    params = {
      feature: feature.label,
      inputs: { template.template_inputs.first.name => 'foobar' },
    }

    get :new, params: params, session: set_session_user
    template_invocation_params = [
      {
        'input_values' =>
        [
          {
            'value' => 'foobar',
            'template_input_id' => template.template_inputs.first.id,
          },
        ],
        'template_id' => template.id,
      },
    ]
    assert_equal(template_invocation_params,
      assigns(:composer).params['template_invocations'])
  end

  test 'should allow no inputs' do
    template = FactoryBot.create(:job_template)
    feature = FactoryBot.create(:remote_execution_feature,
      :job_template => template)
    params = {
      feature: feature.label,
    }
    get :new, params: params, session: set_session_user
    template_invocation_params = [
      {
        'template_id' => template.id,
        'input_values' => {},
      },
    ]
    assert_equal(template_invocation_params,
      assigns(:composer).params['template_invocations'])
  end

  test 'new via GET and POST' do
    template = FactoryBot.create(:job_template, :with_input)
    feature = FactoryBot.create(:remote_execution_feature, job_template: template)
    params = { feature: feature.label, inputs: { template.template_inputs.first.name => 'foobar' } }

    get :new, params: params, session: set_session_user
    assert_response :success

    post :new, params: params, session: set_session_user
    assert_response :success
  end

  context 'restricted access' do
    setup do
      @admin = users(:admin)
      @user = FactoryBot.create(:user, mail: 'test23@test.foreman.com', admin: false)
      @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task)
      @invocation2 = FactoryBot.create(:job_invocation, :with_template, :with_task)

      @invocation.task.update(user: @admin)
      @invocation2.task.update(user: @user)

      setup_user 'view', 'hosts', nil, @user
      setup_user 'view', 'job_invocations', nil, @user
      setup_user 'create', 'job_invocations', nil, @user
      setup_user 'cancel', 'job_invocations', nil, @user
    end

    describe '#index' do
      test 'admin can see all invocations' do
        get :index, session: prepare_user(@admin)
        assert_response :success
        assert 2, assigns(:job_invocations).size
      end

      test 'regular user can see only his invocations' do
        get :index, session: prepare_user(@user)
        assert_response :success
        assert_equal 1, assigns(:job_invocations).size
        assert_equal @invocation2, assigns(:job_invocations).first
      end
    end

    describe '#show' do
      test 'admin can access any invocation' do
        get :show, params: { id: @invocation2.id }, session: prepare_user(@admin)
        assert_response :success
      end

      test 'regular user can access only his invocations' do
        get :show, params: { id: @invocation.id }, session: prepare_user(@user)
        assert_response :not_found
      end
    end

    describe '#rerun' do
      test 'admin can rerun any invocation' do
        get :rerun, params: { id: @invocation2.id }, session: prepare_user(@admin)
        assert_response :success
      end

      test "regular user can't rerun other's invocations" do
        get :rerun, params: { id: @invocation.id }, session: prepare_user(@user)
        assert_response :not_found
      end
    end

    describe '#cancel' do
      test 'admin can cancel any invocation' do
        ForemanTasks::Task.any_instance.expects(:cancel).returns(true)
        post :cancel, params: { id: @invocation2.id }, session: prepare_user(@admin)
        assert_response :redirect
      end

      test "regular user can't cancel other's invocations" do
        post :cancel, params: { id: @invocation.id }, session: prepare_user(@user)
        assert_response :not_found
      end
    end
  end

  def prepare_user(user)
    User.current = user
    set_session_user(user)
  end
end
