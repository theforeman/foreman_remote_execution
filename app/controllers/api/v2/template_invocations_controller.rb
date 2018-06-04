# frozen_string_literal: true

module Api
  module V2
    class TemplateInvocationsController < ::Api::V2::BaseController

      before_action :find_job_invocation, :only => %w{template_invocations}

      api :GET, '/job_invocations/:job_invocation_id/template_invocations',
          N_('List template invocations belonging to job invocation')
      param_group :search_and_pagination, ::Api::V2::BaseController
      param :job_invocation_id, :identifier, :required => true
      def template_invocations
        @template_invocations = resource_scope.paginate(paginate_options)
        render :layout => 'api/v2/layouts/index_layout'
      end

      def resource_scope
        if params[:action] == 'template_invocations'
          resource_scope_for_template_invocations
        else
          super
        end
      end

      private

      def resource_scope_for_template_invocations
        @job_invocation.template_invocations.search_for(*search_options)
      end

      def find_job_invocation
        @job_invocation = JobInvocation.find(params[:id])
      end

      def action_permission
        case params[:action]
        when 'template_invocations'
          :view
        else
          super
        end
      end
    end
  end
end
