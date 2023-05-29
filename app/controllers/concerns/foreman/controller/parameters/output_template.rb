module Foreman::Controller::Parameters::OutputTemplate
  extend ActiveSupport::Concern
  include Foreman::Controller::Parameters::Taxonomix
  include ::Foreman::Controller::Parameters::Template
  include Foreman::Controller::Parameters::TemplateInput

  class_methods do
    def output_template_effective_user_filter
      Foreman::ParameterFilter.new(::OutputTemplateEffectiveUser).tap do |filter|
        filter.permit_by_context(:value, :current_user, :overridable,
          :nested => true)
      end
    end

    def output_template_params_filter
      Foreman::ParameterFilter.new(::TemplateInput).tap do |filter|
        filter.permit :description_format,
          :effective_user_attributes => [output_template_effective_user_filter],
          :template_inputs_attributes => [template_input_params_filter]
        add_template_params_filter(filter)
        add_taxonomix_params_filter(filter)
      end
    end
  end

  def output_template_params
    self.class.output_template_params_filter.filter_params(params, parameter_filter_context, :output_template)
  end
end
