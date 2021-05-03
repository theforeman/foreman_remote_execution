class TemplateInvocationInputValue < ApplicationRecord

  belongs_to :template_invocation
  belongs_to :template_input

  validates :value, :presence => true, :if => proc { |v| v.template_input.required? || v.value.nil? }

  validates :value, :inclusion => { :in => proc { |v| options_for_template_input v.template_input } },
                    :if => proc { |v| v.template_input.input_type == 'user' && v.template_input.options_array.present? }

  class << self

    private

    def options_for_template_input(template_input)
      options = template_input.options_array
      options += [''] unless template_input.required?
      options
    end
  end
end
