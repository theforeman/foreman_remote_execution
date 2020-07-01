# frozen_string_literal: true

require 'test_plugin_helper'

class JobActionsControllerTest < ActionController::TestCase
  setup do
    as_admin { @user = FactoryBot.create(:user, :admin, :with_mail) }
    @action = as_user(@user) { FactoryBot.create(:job_action, job_template: FactoryBot.create(:job_template)) }
  end

  test 'should get index' do
    get :index, session: set_session_user(@user)
    assert_response :success
    assert_equal @action, assigns(:job_actions).first
    assert_equal 1, assigns(:job_actions).size
  end

  test 'should get show' do
    get :show, params: { id: @action.id }, session: set_session_user(@user)
    assert_response :success
  end

  test "should see only user's actions - #show" do
    as_admin { @user2 = FactoryBot.create(:user, :admin, :with_mail) }
    action2 = as_user(@user2) { FactoryBot.create(:job_action, job_template: FactoryBot.create(:job_template)) }

    get :show, params: { id: action2.id }, session: set_session_user(@user)
    assert_response :not_found
  end
end
