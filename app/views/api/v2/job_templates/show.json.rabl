object @job_template

extends "api/v2/job_templates/main"

attributes :template, :locked

child :effective_user => :effective_user do
  attributes :value, :current_user, :overridable
end

node do |job_template|
  partial("api/v2/taxonomies/children_nodes", :object => job_template)
end
