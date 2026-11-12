# frozen_string_literal: true

require 'test_plugin_helper'

class TemplateInvocationsControllerTest < ActionController::TestCase
  setup do
    @invocation = FactoryBot.create(:job_invocation, :with_template, :with_task)
    @template_invocation = @invocation.template_invocations.first
    ForemanTasks::Task.any_instance.stubs(:main_action).returns(OpenStruct.new(:live_output => [], :output => {}))
    ForemanTasks::Task.any_instance.stubs(:execution_plan).returns(OpenStruct.new(:actions => [nil, OpenStruct.new(:input => { 'script' => '' })]))
    ForemanTasks::Task.any_instance.stubs(:cancellable?).returns(false)
  end

  test 'should not show template invocation for a job invocation outside the permission filter' do
    user = setup_user 'view', 'hosts'
    setup_user 'view', 'job_invocations', "id != #{@invocation.id}"

    get :show_template_invocation_by_host,
      params: { id: @invocation.id, host_id: @template_invocation.host_id },
      session: set_session_user(user)

    assert_response :not_found
  end

  test 'should not show template invocation for a host outside the permission filter' do
    user = setup_user 'view', 'job_invocations'
    setup_user 'view', 'hosts', "name != #{@template_invocation.host.name}"

    get :show_template_invocation_by_host,
      params: { id: @invocation.id, host_id: @template_invocation.host_id },
      session: set_session_user(user)

    assert_response :not_found
  end
end
