class TemplateInvocation < ActiveRecord::Base
  include ForemanTasks::Concerns::ActionSubject

  include ForemanRemoteExecution::ErrorsFlattener
  FLATTENED_ERRORS_MAPPING = { :input_values => lambda do |input_value|
                                                 _("Input") + " #{input_value.template_input.name}"
                                                end }


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
    required_inputs = self.template.template_inputs.where(:required => true)
    missing_inputs = required_inputs.reject { |input| self.input_values.map(&:template_input_id).include?(input.id) }
    unless missing_inputs.empty?
      errors.add(:base, _("Not all required inputs have values. Missing inputs: %s") % missing_inputs.map(&:name).join(', '))
    end
  end
end
