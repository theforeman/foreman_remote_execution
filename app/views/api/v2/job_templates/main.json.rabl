object @job_template

extends "api/v2/job_templates/base"

attributes :audit_comment, :created_at, :updated_at

child :template_inputs do
  extends "api/v2/template_inputs/base"
end
