# frozen_string_literal: true

require 'test_plugin_helper'

class TemplateInvocationsControllerTest < ActionController::TestCase
  setup do
    @admin = users(:admin)
    @user = FactoryBot.create(:user, mail: 'template-invocation-user@test.foreman.com', admin: false)
    @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task)
    @invocation.task.update(user: @admin)
    ForemanTasks::Task.any_instance.stubs(:main_action).returns(OpenStruct.new(:live_output => [], :output => {}))
    ForemanTasks::Task.any_instance.stubs(:execution_plan).returns(OpenStruct.new(:actions => [nil, OpenStruct.new(:input => { 'script' => '' })]))
    ForemanTasks::Task.any_instance.stubs(:cancellable?).returns(false)

    setup_user 'view', 'hosts', nil, @user
    setup_user 'view', 'job_invocations', 'user = current_user', @user
  end

  test 'should not show template invocation for a job invocation outside the permission filter' do
    template_invocation = @invocation.template_invocations.first

    get :show_template_invocation_by_host,
      params: { id: @invocation.id, host_id: template_invocation.host_id },
      session: set_session_user(@user)

    assert_response :not_found
  end
end
