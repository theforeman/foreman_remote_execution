module ForemanRemoteExecution
  module Concerns
    module Api
      module V2
        module RegistrationCommandsControllerExtensions
          module ApipieExtensions
            extend Apipie::DSL::Concern

            update_api(:create) do
              param :registration_command, Hash do
                param :remote_execution_interface, String, desc: N_("Identifier of the Host interface for Remote execution")
                param :setup_remote_execution_pull, :bool, desc: N_("Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host")
              end
            end
          end
        end
      end
    end
  end
end
