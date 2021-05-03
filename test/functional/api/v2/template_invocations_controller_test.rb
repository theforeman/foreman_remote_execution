# frozen_string_literal: true

require 'test_plugin_helper'

module Api
  module V2
    class TemplateInvocationsControllerTest < ActionController::TestCase
      setup do
        @job = FactoryBot.create(:job_invocation, :with_template, :with_task)
        @template_invocation = @job.template_invocations.first
      end

      test 'should get template invocations belonging to job invocation' do
        get :template_invocations, params: { :id => @job.id }
        invocations = ActiveSupport::JSON.decode(@response.body)
        _(invocations['results'].count).must_equal @job.template_invocations.count
        _(invocations['total']).must_equal @job.template_invocations.count

        expected_result = {
          'id'                   => @template_invocation.id,
          'host_id'              => @template_invocation.host_id,
          'host_name'            => @template_invocation.host.name,
          'template_id'          => @template_invocation.template_id,
          'effective_user'       => @template_invocation.effective_user,
          'job_invocation_id'    => @job.id,
          'run_host_job_task_id' => @template_invocation.run_host_job_task_id,
        }
        _(invocations['results']).must_equal [expected_result]
        assert_response :success
      end
    end
  end
end
