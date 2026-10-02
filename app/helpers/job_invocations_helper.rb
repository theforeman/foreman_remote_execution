# frozen_string_literal:true

module JobInvocationsHelper
  def show_job_organization(organization)
    organization.presence || _('Any Organization')
  end

  def show_job_location(location)
    location.presence || _('Any Location')
  end

  def input_safe_value(input)
    template_input = input.template_input
    template_input.respond_to?(:hidden_value) && template_input.hidden_value ? '*' * 5 : input.value
  end
end
