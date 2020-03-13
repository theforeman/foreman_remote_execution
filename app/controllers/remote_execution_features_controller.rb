class RemoteExecutionFeaturesController < ::ApplicationController
  before_action :find_resource, :only => [:show, :update]
  include ::Foreman::Controller::Parameters::RemoteExecutionFeature

  def index
    @remote_execution_features = resource_base.all
  end

  def show; end

  def update
    if @remote_execution_feature.update(remote_execution_feature_params)
      process_success :object => @remote_execution_feature
    else
      process_error :object => @remote_execution_feature
    end
  end
end
