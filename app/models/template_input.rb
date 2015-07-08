class TemplateInput < ActiveRecord::Base
  TYPES = { :user => N_('User input'), :fact => N_('Fact value'), :variable => N_('Variable'),
            :puppet_parameter => N_('Puppet parameter') }.with_indifferent_access

  attr_accessible :name, :required, :input_type, :fact_name, :variable_name,
                  :puppet_class_name, :puppet_parameter_name, :description, :job_template_id

  belongs_to :job_template

  validates :name, :presence => true
  validates :input_type, :presence => true, :inclusion => TemplateInput::TYPES.keys

  validates :fact_name, :presence => { :if => :fact_template_input? }
  validates :variable_name, :presence => { :if => :variable_template_input? }
  validates :puppet_parameter_name, :puppet_class_name, :presence => { :if => :puppet_parameter_template_input? }

  def user_template_input?
    input_type == 'user'
  end

  def fact_template_input?
    input_type == 'fact'
  end

  def variable_template_input?
    input_type == 'variable'
  end

  def puppet_parameter_template_input?
    input_type == 'puppet_parameter'
  end
end
