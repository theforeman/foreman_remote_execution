class RemoteExecutionFeaturesController < ::ApplicationController
  before_filter :find_resource, :only => [:show, :update]

  def index
    @remote_execution_features = resource_base.all
  end

  def show
  end

  def update
    if @remote_execution_feature.update_attributes(params[:remote_execution_feature])
      process_success :object => @remote_execution_feature
    else
      process_error :object => @remote_execution_feature
    end
  end

end
