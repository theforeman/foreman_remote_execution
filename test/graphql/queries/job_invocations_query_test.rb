require 'test_plugin_helper'

module Queries
  class JobInvocationsQueryTest < GraphQLQueryTestCase
    let(:query) do
      <<-GRAPHQL
      query {
        jobInvocations {
          totalCount
          nodes {
            id
            jobCategory
          }
        }
      }
      GRAPHQL
    end

    let(:data) { result['data']['jobInvocations'] }

    setup do
      FactoryBot.create_list(:job_invocation, 2)
    end

    test 'should fetch job invocations' do
      assert_empty result['errors']

      expected_count = JobInvocation.count

      assert_not_equal 0, expected_count
      assert_equal expected_count, data['totalCount']
      assert_equal expected_count, data['nodes'].count
    end
  end
end
