class TemplateInvocationInputValue < ActiveRecord::Base

  belongs_to :template_invocation
  belongs_to :template_input

  validates :value, :presence => true, :if => proc { |v| v.template_input.required? }

  validates :value, :inclusion => { :in => proc { |v| v.template_input.options_array } },
                    :if => proc { |v| v.template_input.input_type == 'user' && v.template_input.options_array.present? }
end
