module Api
  module V2
    module InterfacesControllerExtensions
      extend Apipie::DSL::Concern

      update_api(:create, :update) do
        param :interface, Hash do
          param :execution, :bool, :desc => N_('Should this interface be used for remote execution?')
        end
      end
    end
  end
end
