object @job_template

extends 'api/v2/job_templates/base'

attributes :description, :description_format, :created_at, :updated_at, :template, :locked, :cloned_from_id

child :template_inputs do
  extends 'api/v2/template_inputs/base'
end

child :effective_user => :effective_user do
  attributes :value, :current_user, :overridable
end

node do |job_template|
  partial('api/v2/taxonomies/children_nodes', :object => job_template)
end
