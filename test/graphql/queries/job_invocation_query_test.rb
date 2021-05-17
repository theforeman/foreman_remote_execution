require 'test_helper'

module Queries
  class JobInvocationQueryTest < GraphQLQueryTestCase
    let(:query) do
      <<-GRAPHQL
      query (
        $id: String!
      ) {
        jobInvocation(id: $id) {
          id
          jobCategory
        }
      }
      GRAPHQL
    end

    let(:job_invocation) { FactoryBot.create(:job_invocation) }

    let(:global_id) { Foreman::GlobalId.for(job_invocation) }
    let(:variables) { { id: global_id } }
    let(:data) { result['data']['jobInvocation'] }

    test 'fetching job invocation attributes' do
      assert_empty result['errors']

      assert_equal global_id, data['id']
      assert_equal job_invocation.job_category, data['jobCategory']
    end
  end
end
