module ForemanRemoteExecution
  module Concerns
    module Api::V2::RegistrationControllerExtensions
      extend Apipie::DSL::Concern
      extend ActiveSupport::Concern

      update_api(:global, :host) do
        param :remote_execution_interface, String, desc: N_("Identifier of the Host interface for Remote execution")
      end

      def host_setup_extension
        remote_execution_interface
        super
      end

      def remote_execution_interface
        return unless params['remote_execution_interface'].present?

        interfaces = @host.interfaces
        interfaces.find_by!(identifier: params['remote_execution_interface'])

        # Only one interface at time can be used for REX, all other must be set to false
        interfaces.each { |int| int.execution = (int.identifier == params['remote_execution_interface']) }
        interfaces.each(&:save!)
      end
    end
  end
end
