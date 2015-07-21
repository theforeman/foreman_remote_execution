class TemplateInput < ActiveRecord::Base
  class ValueNotReady < ::Foreman::Exception
  end

  TYPES = { :user => N_('User input'), :fact => N_('Fact value'), :variable => N_('Variable'),
            :puppet_parameter => N_('Puppet parameter') }.with_indifferent_access

  attr_accessible :name, :required, :input_type, :fact_name, :variable_name,
                  :puppet_class_name, :puppet_parameter_name, :description, :job_template_id

  belongs_to :template
  has_many :template_invocation_input_values, :dependent => :destroy

  validates :name, :presence => true, :uniqueness => { :scope => 'template_id' }
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

  def preview(renderer)
    get_resolver(renderer).preview
  end

  def value(renderer)
    get_resolver(renderer).value
  end

  private

  def get_resolver(renderer)
    resolver_class = case input_type
      when 'user'
        UserInputResolver
      when 'fact'
        FactInputResolver
      when 'variable'
        VariableInputResolver
      when 'puppet_parameter'
        PuppetParameterInputResolver
      else
        raise "unknown template input type #{input_type.inspect}"
      end
    resolver_class.new(self, renderer)
  end

  class InputResolver
    def initialize(input, renderer)
      @input = input
      @renderer = renderer
    end

    def preview
      ready? ? resolved_value : preview_value
    end

    def value
      ready? ? resolved_value : raise(ValueNotReady, "Input '#{@input.name}' is not ready for rendering")
    end

    def preview_value
      "$#{@input.input_type.upcase}_INPUT[#{@input.name}]"
    end

    # should be defined in descendants
    def ready?
      raise NotImplementedError
    end

    # should be defined in descendants
    def resolved_value
      raise NotImplementedError
    end
  end

  class UserInputResolver < InputResolver
    def ready?
      # TODO based on job invocation
      false
    end

    def resolved_value
      # TODO based on job invocation
      raise StandardError
    end
  end

  class FactInputResolver < InputResolver
    # fact might not be present if it hasn't been uploaded yet, there's typo in name
    def ready?
      @renderer.host && get_fact.present?
    end

    def resolved_value
      get_fact.value
    end

    private

    def get_fact
      @fact ||= @renderer.host.fact_values.includes(:fact_name).where(:'fact_names.name' => @input.fact_name).first
    end
  end

  class VariableInputResolver < InputResolver
    def ready?
      @renderer.host && @renderer.host.params.key?(@input.variable_name)
    end

    def resolved_value
      @renderer.host.params[@input.variable_name]
    end
  end

  class PuppetParameterInputResolver < InputResolver
    def ready?
      @renderer.host &&
        get_enc.key?(@input.puppet_class_name) &&
        get_enc[@input.puppet_class_name].is_a?(Hash) &&
        get_enc[@input.puppet_class_name].key?(@input.puppet_parameter_name)
    end

    def resolved_value
      get_enc[@input.puppet_class_name][@input.puppet_parameter_name]
    end

    private

    def get_enc
      @enc ||= Classification::ClassParam.new(:host => @renderer.host).enc
    end
  end
end
