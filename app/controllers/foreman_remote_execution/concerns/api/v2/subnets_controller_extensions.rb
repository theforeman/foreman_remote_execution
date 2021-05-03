module ForemanRemoteExecution
  module Concerns
    module Api::V2::SubnetsControllerExtensions
      module ApiPieExtensions
        extend ::Apipie::DSL::Concern

        update_api(:create, :update) do
          param :subnet, Hash do
            param :remote_execution_proxy_ids, Array, _('List of proxy IDs to be used for remote execution')
          end
        end
      end

      extend ActiveSupport::Concern

      included do
        include ApiPieExtensions
      end
    end
  end
end
