module Foreman::Controller::Parameters::JobTemplate
  extend ActiveSupport::Concern
  include Foreman::Controller::Parameters::Taxonomix
  include Foreman::Controller::Parameters::Template
  include Foreman::Controller::Parameters::TemplateInput
  include Foreman::Controller::Parameters::ForeignInputSet

  class_methods do
    def job_template_effective_user_filter
      Foreman::ParameterFilter.new(::JobTemplateEffectiveUser).tap do |filter|
        filter.permit_by_context(:value, :current_user, :overridable,
          :nested => true)
      end
    end

    def job_template_params_filter
      Foreman::ParameterFilter.new(::TemplateInput).tap do |filter|
        filter.permit :job_category, :provider_type, :description_format, :execution_timeout_interval, :output_template_ids => [],
          :effective_user_attributes => [job_template_effective_user_filter],
          :template_inputs_attributes => [template_input_params_filter],
          :foreign_input_sets_attributes => [foreign_input_set_params_filter]
        add_template_params_filter(filter)
        add_taxonomix_params_filter(filter)
      end
    end
  end

  def job_template_params
    self.class.job_template_params_filter.filter_params(params, parameter_filter_context, :job_template)
  end
end
