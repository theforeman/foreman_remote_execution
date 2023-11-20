module Api
  module V2
    module HostsControllerExtensions
      extend ActiveSupport::Concern
      def index_node_permissions
        super.merge({
          :can_create_job_invocations => authorized_for(:controller => 'job_invocations', :action => 'create'),
        })
      end
    end
  end
end
