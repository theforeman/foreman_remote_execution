require 'test_plugin_helper'

module Mutations
  module JobInvocations
    class CreateMutationTest < ActiveSupport::TestCase
      let(:host) { FactoryBot.create(:host) }
      let(:job_template) { FactoryBot.create(:job_template, :with_input) }
      let(:cron_line) { '5 * * * *' }
      let(:purpose) { 'test' }
      let(:variables) do
        {
          jobInvocation: {
            hostIds: [host.id],
            jobTemplateId: job_template.id,
            targetingType: 'static_query',
            inputs: { job_template.template_inputs.first.name => "bar" },
            recurrence: {
              cronLine: cron_line,
              purpose:  purpose,
            },
          },
        }
      end

      let(:query) do
        <<-GRAPHQL
          mutation CreateJobInvocation($jobInvocation: JobInvocationInput!) {
              createJobInvocation(input: { jobInvocation: $jobInvocation }) {
                jobInvocation {
                  id
                  description
                  recurringLogic {
                    cronLine
                    purpose
                  }
                }
              }
            }
        GRAPHQL
      end

      context 'with admin user' do
        let(:user) { FactoryBot.create(:user, :admin) }
        let(:context) { { current_user: user } }

        test 'create a job invocation' do
          assert_difference('JobInvocation.count', +1) do
            result = ForemanGraphqlSchema.execute(query, variables: variables, context: context)
            assert_empty result['errors']
            assert_empty result['data']['createJobInvocation']['jobInvocation']['errors']
            assert_equal cron_line, result['data']['createJobInvocation']['jobInvocation']['recurringLogic']['cronLine']
            assert_equal purpose, result['data']['createJobInvocation']['jobInvocation']['recurringLogic']['purpose']
          end
        end
      end
    end
  end
end
