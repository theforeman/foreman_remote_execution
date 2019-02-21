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
      def show; end

      def_param_group :remote_execution_feature do
        param :remote_execution_feature, Hash, :required => true, :action_aware => true do
          param :job_template_id, :identifier, :required => true, :desc => N_('Job template ID to be used for the feature')
        end
      end

      api :PUT, '/remote_execution_features/:id', N_('Update a job template')
      param :id, :identifier, :required => true
      param_group :remote_execution_feature
      def update
        process_response @remote_execution_feature.update_attributes(remote_execution_feature_params)
      end

      def cockpit_url_for_host(host)
        tmpl = Setting[:remote_execution_cockpit_href]
        tmpl && tmpl != "" ? tmpl % { :host => host } : nil
      end

      def cockpit_redirect
        return head(:forbidden) unless params[:redirect_uri]
        redir_url = URI.parse(params[:redirect_uri])
        cockpit_url = cockpit_url_for_host("")
        redir_url.query = if redir_url.hostname == URI.join(Setting[:foreman_url], cockpit_url).hostname
                            "access_token=#{request.session_options[:id]}"
                          else
                            "error_description=Sorry"
                          end
        redirect_to(redir_url.to_s)
      end

      private

      def parent_scope
        resource_class.where(nil)
      end
    end
  end
end
