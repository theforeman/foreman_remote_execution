class InvocationProviderInputValue < ApplicationRecord
  belongs_to :template_invocation

  validates :name, :presence => true

  validates :value, :inclusion => { :in => proc { |v| v.provider_input.options_array } },
                    :if => proc { |v| v.provider_input.options_array.present? }

  def provider_input
    template_invocation.template.provider.provider_inputs.find { |item| item.name == name }
  end
end
