class JobTemplateOutputTemplate < ApplicationRecord
  belongs_to :job_template
  belongs_to :output_template
end
