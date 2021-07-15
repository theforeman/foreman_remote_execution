require 'test_plugin_helper'

module Mutations
  module JobInvocations
    class CreateMutationTest < ActiveSupport::TestCase
      let(:host) { FactoryBot.create(:host) }
      let(:job_template) { FactoryBot.create(:job_template, :with_input) }
      let(:cron_line) { '5 * * * *' }
      let(:variables) do
        {
          hostIds: [host.id],
          jobTemplateId: job_template.id,
          targetingType: 'static_query',
          recurrence: { cronLine: cron_line },
        }
      end
      let(:query) do
        <<-GRAPHQL
          mutation CreateJobInvocation(
            $hostIds: [Int!],
            $jobTemplateId: Int,
            $targetingType: TargetingEnum!,
            $recurrence: RecurrenceInput) {
              createJobInvocation(input: { hostIds: $hostIds, jobTemplateId: $jobTemplateId, targetingType: $targetingType, recurrence: $recurrence }) {
                jobInvocation {
                  id
                  description
                  recurringLogic {
                    cronLine
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
          end
        end
      end
    end
  end
end
