class TemplateInvocation < ActiveRecord::Base
  include Authorizable
  include ForemanTasks::Concerns::ActionSubject

  include ForemanRemoteExecution::ErrorsFlattener
  FLATTENED_ERRORS_MAPPING = { :input_values => lambda do |input_value|
                                                 _('Input') + " #{input_value.template_input.name}"
                                                end }.freeze


  belongs_to :template, :class_name => 'JobTemplate', :foreign_key => 'template_id'
  belongs_to :job_invocation, :inverse_of => :template_invocations
  has_many :input_values, :class_name => 'TemplateInvocationInputValue', :dependent => :destroy
  has_one :targeting, :through => :job_invocation
  belongs_to :host, :class_name => 'Host::Managed', :foreign_key => :host_id
  has_one :host_group, :through => :host, :source => :hostgroup
  belongs_to :run_host_job_task, :class_name => 'ForemanTasks::Task'

  validates_associated :input_values
  validate :provides_required_input_values
  before_validation :set_effective_user

  scoped_search :in => :host, :on => :name, :rename => 'host.name', :complete_value => true
  scoped_search :in => :host_group, :on => :name, :rename => 'host_group.name', :complete_value => true
  scoped_search :in => :template, :on => :job_category, :complete_value => true
  scoped_search :in => :template, :on => :name, :complete_value => true

  def to_action_input
    { :id => id, :name => template.name }
  end

  def deep_clone
    self.dup.tap do |invocation|
      invocation.input_values = self.input_values.map(&:dup)
    end
  end

  def deep_clone!
    deep_clone.tap(&:save!)
  end

  private

  def provides_required_input_values
    required_inputs = self.template.template_inputs.where(:required => true)
    missing_inputs = required_inputs.reject { |input| self.input_values.map(&:template_input_id).include?(input.id) }
    unless missing_inputs.empty?
      errors.add(:base, _('Not all required inputs have values. Missing inputs: %s') % missing_inputs.map(&:name).join(', '))
    end
  end

  def set_effective_user
    if template.provider.supports_effective_user?
      self.effective_user = Setting[:remote_execution_effective_user] if self.effective_user.blank?
    else
      self.effective_user = nil
    end
  end
end
