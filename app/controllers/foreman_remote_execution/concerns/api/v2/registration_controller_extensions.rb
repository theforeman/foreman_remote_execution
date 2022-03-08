module ForemanRemoteExecution
  module Concerns
    module Api::V2::RegistrationControllerExtensions
      module ApipieExtensions
        extend Apipie::DSL::Concern

        update_api(:global, :host) do
          param :remote_execution_interface, String, desc: N_("Identifier of the Host interface for Remote execution")
        end
      end

      extend ActiveSupport::Concern

      def host_setup_extension
        remote_execution_interface
        reset_host_known_keys! unless @host.new_record?
        super
      end

      def remote_execution_interface
        return unless params['remote_execution_interface'].present?

        @host.set_execution_interface(params['remote_execution_interface'])
      end

      def reset_host_known_keys!
        @host.host_proxy_invocations.destroy_all
      end
    end
  end
end
