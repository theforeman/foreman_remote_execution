object @job_invocation

child @pattern_template_invocations => :pattern_template_invocations do
  attributes :template_id, :template_name, :host_id
  child :input_values do
    attributes :template_input_name, :template_input_id
    node :value do |iv|
      iv.template_input.respond_to?(:hidden_value) && iv.template_input.hidden_value? ? '*' * 5 : iv.value
    end
  end
end

extends 'api/v2/job_invocations/main'

node :job_organization do
  @job_organization
end

node :job_location do
  @job_location
end
