module Api
  module V2
    class RemoteExecutionFeaturesController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Controller::Parameters::RemoteExecutionFeature

      before_action :find_resource, :only => %w{show update}

      api :GET, '/remote_execution_features/', N_('List remote execution features')
      def index
        @remote_execution_features = resource_scope
      end

      api :GET, '/remote_execution_features/:id', N_('Show remote execution feature')
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :remote_execution_feature do
        param :remote_execution_feature, Hash, :required => true, :action_aware => true do
          param :job_template_id, :identifier, :required => true, :desc => N_('Job template ID to be used for the feature')
        end
      end

      api :PUT, '/remote_execution_features/:id', N_('Update a job template')
      param :id, :identifier, :required => true
      param_group :remote_execution_feature
      def update
        process_response @remote_execution_feature.update(remote_execution_feature_params)
      end

      api :GET, '/api/hosts/:id/available_remote_execution_features', N_('List available remote execution features for a host')
      param :id, :identifier, :required => true
      def available_remote_execution_features
        host = Host.find(params[:id])
        @remote_execution_features = resource_scope
        @permissions = {:can_run_job => (authorized_for(controller: :job_invocations, action: :create) && (!host.infrastructure_host? || User.current.can?(:execute_jobs_on_infrastructure_hosts))) }
      end

      private

      def parent_scope
        resource_class.where(nil)
      end
    end
  end
end
