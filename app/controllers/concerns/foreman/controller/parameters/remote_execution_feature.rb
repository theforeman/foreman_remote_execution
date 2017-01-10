module Foreman::Controller::Parameters::RemoteExecutionFeature
  extend ActiveSupport::Concern

  class_methods do
    def remote_execution_feature_params_filter
      ::Foreman::ParameterFilter.new(::RemoteExecutionFeature).tap do |filter|
        filter.permit :label, :name, :provided_input_names, :description, :job_template_id, :host_action_button
      end
    end
  end

  def remote_execution_feature_params
    self.class.remote_execution_feature_params_filter.filter_params(params, parameter_filter_context, :remote_execution_feature)
  end
end
