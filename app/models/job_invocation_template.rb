class JobInvocationTemplate < ApplicationRecord
  belongs_to :job_invocation
  belongs_to :output_template
end
