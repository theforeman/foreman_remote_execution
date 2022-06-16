module ForemanRemoteExecution
  module Concerns
    module Api::V2::RegistrationControllerExtensions
      module ApipieExtensions
        extend Apipie::DSL::Concern

        update_api(:global, :host) do
          param :remote_execution_interface, String, desc: N_("Identifier of the Host interface for Remote execution")
          param :setup_remote_execution_pull, :bool, desc: N_("Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host")
        end
      end

      extend ActiveSupport::Concern

      def host_setup_extension
        remote_execution_interface
        remote_execution_pull
        reset_host_known_keys! unless @host.new_record?
        super
      end

      def remote_execution_pull
        HostParameter.where(host: @host, name: 'host_registration_remote_execution_pull').destroy_all

        setup_host_param('host_registration_remote_execution_pull', ActiveRecord::Type::Boolean.new.deserialize(params['setup_remote_execution_pull']))
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
