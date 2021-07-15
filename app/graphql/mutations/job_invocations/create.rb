module Mutations
  module JobInvocations
    class Create < ::Mutations::CreateMutation
      description 'Create a new job invocation'
      graphql_name 'CreateJobInvocationMutation'

      argument :job_category, String, required: false
      argument :job_template_id, Integer, required: false
      argument :feature, String, required: false
      argument :targeting_type, ::Types::TargetingEnum
      argument :recurrence, ::Types::RecurrenceInput, required: false
      argument :scheduling, ::Types::SchedulingInput, required: false
      argument :search_query, String, required: false
      argument :host_ids, [Integer], required: false

      field :job_invocation, ::Types::JobInvocation, 'The new job invocation', null: true

      def resolve(params)
        composer = JobInvocationComposer.from_api_params(params)
        job_invocation = composer.job_invocation
        authorize!(job_invocation, :create)
        composer.trigger!

        {
          result_key => job_invocation,
          :errors => job_invocation.errors.empty? ? [] : map_errors_to_path(job_invocation),
        }
      end
    end
  end
end
