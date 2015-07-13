object @job_template

extends "api/v2/job_templates/main"

attributes :template, :locked

node do |job_template|
  partial("api/v2/taxonomies/children_nodes", :object => job_template)
end
