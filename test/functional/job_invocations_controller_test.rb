# frozen_string_literal: true

require 'test_plugin_helper'

class JobInvocationsControllerTest < ActionController::TestCase
  context '#report' do
    setup do
      @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task)
      @report_template = FactoryBot.create(:report_template, :name => 'Job - Invocation Report', :template => '<%= "report output" %>')
      @report_template.template_inputs.create!(:name => 'job_id', :input_type => 'user')
      Setting['remote_execution_job_invocation_report_template'] = @report_template.name
    end

    test 'should redirect to report generation page' do
      get :report, params: { :id => @invocation.id }, session: set_session_user
      template_input = @report_template.template_inputs.where(name: 'job_id').first
      expected_params = {
        report_template_report: {
          input_values: {
            "#{template_input.id}": {
              value: @invocation.id,
            },
          },
        },
      }
      assert_redirected_to generate_report_template_path(@report_template, expected_params)
    end

    test 'should redirect to report generation page with custom template name' do
      custom_template = FactoryBot.create(:report_template, :name => 'My Custom Job Report', :template => '<%= "custom report" %>')
      custom_template.template_inputs.create!(:name => 'job_id', :input_type => 'user')
      Setting['remote_execution_job_invocation_report_template'] = custom_template.name

      get :report, params: { :id => @invocation.id }, session: set_session_user
      template_input = custom_template.template_inputs.where(name: 'job_id').first
      expected_params = {
        report_template_report: {
          input_values: {
            "#{template_input.id}": {
              value: @invocation.id,
            },
          },
        },
      }
      assert_redirected_to generate_report_template_path(custom_template, expected_params)
    end

    test 'should return 404 when report template is not configured' do
      Setting['remote_execution_job_invocation_report_template'] = 'Nonexistent Template'
      get :report, params: { :id => @invocation.id }, session: set_session_user
      assert_response :not_found
    end

    test 'should deny access when user lacks generate_report_templates permission' do
      user = FactoryBot.create(:user, :admin => false)
      @report_template.organizations = user.organizations
      @report_template.locations = user.locations
      setup_user('view', 'job_invocations', nil, user)
      setup_user('view', 'hosts', nil, user)
      setup_user('view', 'report_templates', nil, user)

      get :report, params: { :id => @invocation.id }, session: set_session_user(user)
      assert_response :forbidden
    end

    test 'should redirect when user has generate_report_templates permission' do
      user = FactoryBot.create(:user, :admin => false)
      @report_template.organizations = user.organizations
      @report_template.locations = user.locations
      setup_user('view', 'job_invocations', nil, user)
      setup_user('view', 'hosts', nil, user)
      setup_user('view', 'report_templates', nil, user)
      setup_user('generate', 'report_templates', nil, user)

      get :report, params: { :id => @invocation.id }, session: set_session_user(user)
      template_input = @report_template.template_inputs.where(name: 'job_id').first
      expected_params = {
        report_template_report: {
          input_values: {
            "#{template_input.id}": {
              value: @invocation.id,
            },
          },
        },
      }
      assert_redirected_to generate_report_template_path(@report_template, expected_params)
    end
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
      setup_user 'view', 'job_invocations', 'user = current_user', @user
      setup_user 'create', 'job_invocations', 'user = current_user', @user
      setup_user 'cancel', 'job_invocations', 'user = current_user', @user
    end

    context 'without user filter' do
      test '#index' do
        get :index, session: prepare_user(@admin)
        assert_response :success
        assert 2, assigns(:job_invocations).size
      end

      test '#cancel' do
        ForemanTasks::Task.any_instance.expects(:cancel).returns(true)
        post :cancel, params: { id: @invocation2.id }, session: prepare_user(@admin)
        assert_response :redirect
      end
    end

    context 'with user filter' do
      test '#index' do
        get :index, session: prepare_user(@user)
        assert_response :success
        assert_equal 1, assigns(:job_invocations).size
        assert_equal @invocation2, assigns(:job_invocations)[0]
      end

      test 'cancel' do
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
