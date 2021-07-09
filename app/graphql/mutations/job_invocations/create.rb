module Mutations
  module JobInvocations
    class Create < ::Mutations::CreateMutation
      description 'Create a new job invocation'
      graphql_name 'CreateJobInvocationMutation'

      argument :job_invocation, ::Types::JobInvocationInput, required: true
      field :job_invocation, ::Types::JobInvocation, 'The new job invocation', null: true

      def resolve(params)
        begin
          composer = JobInvocationComposer.from_api_params(params[:job_invocation].to_h)
          job_invocation = composer.job_invocation
          authorize!(job_invocation, :create)
          errors = []
          composer.trigger!
        rescue ActiveRecord::RecordNotSaved
          errors = map_all_errors(job_invocation)
        rescue JobInvocationComposer::JobTemplateNotFound, JobInvocationComposer::FeatureNotFound => e
          errors = [{ path => ['job_template'], :message => e.message }]
        end

        {
          result_key => job_invocation,
          :errors => errors,
        }
      end

      def map_all_errors(job_invocation)
        map_errors_to_path(job_invocation) + map_errors('triggering', job_invocation.triggering) + map_errors('targeting', job_invocation.targeting)
      end

      def map_errors(attr_name, resource)
        resource.errors.map do |attribute, message|
          {
            path: [attr_name, attribute.to_s.camelize(:lower)],
            message: message,
          }
        end
      end
    end
  end
end
