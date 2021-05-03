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
              end
            end
          end
        end
      end
    end
  end
end
