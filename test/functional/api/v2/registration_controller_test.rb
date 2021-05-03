require 'test_plugin_helper'

module Api
  module V2
    # Tests for the extra methods to play roles on a Host
    class RegistrationControllerTest < ActionController::TestCase
      describe 'host registration' do
        let(:organization) { FactoryBot.create(:organization) }
        let(:tax_location) { FactoryBot.create(:location) }
        let(:template) do
          FactoryBot.create(
            :provisioning_template,
            template_kind: template_kinds(:host_init_config),
            template: 'template content <%= @host.name %>',
            locations: [tax_location],
            organizations: [organization]
          )
        end
        let(:os) do
          FactoryBot.create(
            :operatingsystem,
            :with_associations,
            family: 'Redhat',
            provisioning_templates: [
              template,
            ]
          )
        end

        let(:host_params) do
          { host: { name: 'centos-test.example.com',
                    managed: false, build: false,
                    organization_id: organization.id,
                    location_id: tax_location.id,
                    operatingsystem_id: os.id } }
        end

        describe 'remote_execution_interface' do
          setup do
            Setting[:default_host_init_config_template] = template.name
            @host = Host.create(host_params[:host])
            @interface0 = FactoryBot.create(:nic_managed, host: @host, identifier: 'dummy0', execution: false)
          end

          test 'with existing interface' do
            params = host_params.merge(remote_execution_interface: @interface0.identifier)

            post :host, params: params, session: set_session_user
            assert_response :success
            assert @interface0.reload.execution
          end

          test 'with not-existing interface' do
            params = host_params.merge(remote_execution_interface: 'dummy999')

            post :host, params: params, session: set_session_user
            assert_response :not_found
          end

          test 'with multiple interfaces' do
            interface1 = FactoryBot.create(:nic_managed, host: @host, identifier: 'dummy1', execution: false)
            params = host_params.merge(remote_execution_interface: interface1.identifier)

            post :host, params: params, session: set_session_user
            assert_response :success
            refute @interface0.reload.execution
            assert interface1.reload.execution
          end
        end
      end
    end
  end
end
