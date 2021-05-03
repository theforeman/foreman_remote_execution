module ::Foreman::Controller::Parameters::ForeignInputSet
  extend ActiveSupport::Concern

  class_methods do
    def foreign_input_set_params_filter
      Foreman::ParameterFilter.new(::ForeignInputSet).tap do |filter|
        filter.permit_by_context(:id, :_destroy, :template_id, :target_template_id, :include_all, :include, :exclude,
          :nested => true)
      end
    end
  end

  def foreign_input_set_params
    self.class.foreign_input_set_params_filter.filter_params(params, parameter_filter_context, :foreign_input_set)
  end
end
