class JobInvocation < ActiveRecord::Base

  belongs_to :targeting
  has_many :template_invocations, :inverse_of => :job_invocation

  validates :targeting, :presence => true
  validates :job_name, :presence => true

end
