class TemplateInvocation < ActiveRecord::Base
  include ForemanTasks::Concerns::ActionSubject

  belongs_to :template, :class_name => 'JobTemplate', :foreign_key => 'template_id'
  belongs_to :job_invocation, :inverse_of => :template_invocations
  has_many :input_values, :class_name => 'TemplateInvocationInputValue', :dependent => :destroy
  has_one :targeting, :through => :job_invocation

  validates_associated :input_values
  validate :provides_required_input_values

  def to_action_input
    { :id => id, :name => template.name }
  end

  private

  def provides_required_input_values
    required_input_ids = self.template.template_inputs.where(:required => true).pluck(:id)
    unless (required_input_ids - self.input_values.map(&:template_input_id)).empty?
      errors.add(:base, _("Not all required inputs have values."))
    end
  end
end
