class TemplateInvocation < ActiveRecord::Base

  belongs_to :template, :class_name => 'JobTemplate', :foreign_key => 'template_id'
  belongs_to :job_invocation, :inverse_of => :template_invocations
  has_many :input_values, :class_name => 'TemplateInvocationInputValue', :dependent => :destroy
  has_one :targeting, :through => :job_invocation

end
