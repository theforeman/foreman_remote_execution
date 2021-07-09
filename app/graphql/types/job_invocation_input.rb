module Types
  class JobInvocationInput < BaseInputObject
    argument :job_category, String, required: false
    argument :job_template_id, Integer, required: false
    argument :feature, String, required: false
    argument :targeting_type, ::Types::TargetingEnum, required: false
    argument :recurrence, ::Types::RecurrenceInput, required: false
    argument :scheduling, ::Types::SchedulingInput, required: false
    argument :search_query, String, required: false
    argument :host_ids, [Integer], required: false
    argument :inputs, ::Types::RawJson, required: false
  end
end
