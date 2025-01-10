object @job_invocation

attribute :pattern_template_invocations

extends 'api/v2/job_invocations/main'

node :job_organization do
  @job_organization
end

node :job_location do
  @job_location
end

# node :inputs do
#   # @job_invocation.pattern_template_invocations[0][:input_values]
#   @job_invocation.pattern_template_invocations[0].input_values
#   # @job_invocation.pattern_template_invocations.map(&:input_values)
#   # @job_invocation.pattern_template_invocations.map{ |invocation| invocation.input_values
# # }
# end

# child @job_invocation.pattern_template_invocations => :pattern_template_invocations do |template|
# puts template.inspect
#   # @job_invocation.pattern_template_invocations
#   child template.input_values => :input_values do
#     attributes :template_input_name, :template_input_id
#     node :value do |iv|
#       iv.template_input.respond_to?(:hidden_value) && iv.template_input.hidden_value? ? '*' * 5 : iv.value
#     end
#   end
# end

# child @inputs do
#   child :input_values do
#     attributes :template_input_name, :template_input_id
#     node :value do |iv|
#       iv.template_input.respond_to?(:hidden_value) && iv.template_input.hidden_value? ? '*' * 5 : iv.value
#     end
#   end
# end
