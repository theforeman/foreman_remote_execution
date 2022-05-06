class TemplateInvocation < ApplicationRecord
  include Authorizable
  include ForemanTasks::Concerns::ActionSubject

  include ForemanRemoteExecution::ErrorsFlattener
  FLATTENED_ERRORS_MAPPING = { :input_values => lambda do |input_value|
                                                 _('Input') + " #{input_value.template_input.name}"
                                                end }.freeze


  belongs_to :template, :class_name => 'JobTemplate', :foreign_key => 'template_id'
  belongs_to :job_invocation, :inverse_of => :template_invocations
  has_many :input_values, :class_name => 'TemplateInvocationInputValue', :dependent => :destroy
  has_many :provider_input_values, :class_name => 'InvocationProviderInputValue', :dependent => :destroy
  has_one :targeting, :through => :job_invocation
  belongs_to :host, :class_name => 'Host::Managed', :foreign_key => :host_id
  has_one :host_group, :through => :host, :source => :hostgroup
  belongs_to :run_host_job_task, :class_name => 'ForemanTasks::Task'
  has_many :remote_execution_features, :through => :template

  validates_associated :input_values
  validate :provides_required_input_values
  before_validation :set_effective_user

  scoped_search :relation => :host, :on => :name, :rename => 'host.name', :complete_value => true
  scoped_search :relation => :host_group, :on => :name, :rename => 'host_group.name', :complete_value => true
  scoped_search :relation => :template, :on => :job_category, :complete_value => true
  scoped_search :relation => :template, :on => :name, :complete_value => true
  scoped_search :relation => :remote_execution_features, :on => :name, :rename => 'feature'

  class TaskResultMap
    MAP = {
      :cancelled => :cancelled,
      :error     => :failed,
      :pending   => :pending,
      :success   => :success,
      :warning   => :failed,
    }.with_indifferent_access

    REVERSE_MAP = MAP.each_with_object({}) do |(key, value), acc|
      acc[value] ||= []
      acc[value] << key
    end.with_indifferent_access

    class << self
      def results
        MAP.keys.map(&:to_sym)
      end

      def statuses
        REVERSE_MAP.keys.map(&:to_sym)
      end

      # 1:1
      # error => failed
      def task_result_to_status(result)
        MAP[result].try(:to_sym) || result
      end

      # 1:n
      # failed => [:error, :warning]
      def status_to_task_result(status)
        if REVERSE_MAP.key? status
          REVERSE_MAP[status].map(&:to_sym)
        else
          Array(status)
        end
      end
    end
  end

  def template
    JobTemplate.unscoped { super }
  end

  def to_action_input
    { :id => id, :name => template.name }
  end

  def deep_clone
    self.dup.tap do |invocation|
      invocation.input_values = self.input_values.map(&:dup)
      invocation.provider_input_values = self.provider_input_values.map(&:dup)
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
