module ForemanRemoteExecution
  class ProviderInput
    attr_reader :name, :label, :description, :options, :value_type, :required
    attr_accessor :value

    def initialize(name:, label:, value:, description: nil, options: nil, value_type: nil, required: false, hidden: false)
      @name = name
      @label = label
      @value = value
      @description = description
      @options = options
      @value_type = value_type
      @required = required
      @hidden = hidden
    end

    def template_input
      self
    end

    def hidden_value?
      @hidden
    end

    def options_array
      options.blank? ? [] : options.split(/\r?\n/).map(&:strip)
    end
  end
end
