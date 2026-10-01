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
          def registration_uuid
            uuid = SecureRandom.uuid
            if defined?(Katello::Host::SubscriptionFacet)
              Katello::Host::SubscriptionFacet.create!(host: @host, uuid: uuid)
            else
              # Katello normally resolves the UUID to this host before REX runs.
              @controller.stubs(:find_host).returns(nil)
            end
            uuid
          end

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

          test 'with multiple interfaces selects only the requested interface' do
            interface1 = FactoryBot.create(:nic_managed, host: @host, identifier: 'dummy1', execution: false)
            @interface0.update!(execution: true)
            params = host_params.merge(remote_execution_interface: interface1.identifier)

            post :host, params: params, session: set_session_user

            assert_response :success
            refute @interface0.reload.execution
            assert interface1.reload.execution
          end

          test 'selects an existing primary interface and preserves its network attributes' do
            primary = @host.primary_interface
            primary.update!(identifier: 'enp3s0', ip: '192.0.2.10', mac: '02:00:00:00:00:10', name: @host.name)
            primary_id = primary.id

            params = host_params.merge(remote_execution_interface: 'enp3s0')
            post :host, params: params, session: set_session_user

            assert_response :success
            primary.reload
            assert_equal primary_id, primary.id
            assert_equal 'enp3s0', primary.identifier
            assert_equal '192.0.2.10', primary.ip
            assert_equal '02:00:00:00:00:10', primary.mac
            assert_equal @host.name, primary.name
            assert primary.primary?
            assert primary.execution
            assert_equal 1, @host.reload.interfaces.where(identifier: 'enp3s0').count
          end

          test 'uses the sole primary interface for remote execution without duplicating it' do
            primary = @host.primary_interface
            @host.interfaces.where.not(id: primary.id).destroy_all
            primary.update!(
              identifier: 'enp3s0',
              ip: '192.0.2.30',
              mac: '02:00:00:00:00:30',
              name: @host.name
            )
            primary_id = primary.id

            params = host_params.merge(remote_execution_interface: 'enp3s0')
            post :host, params: params, session: set_session_user

            assert_response :success
            host = @host.reload
            assert_equal 1, host.interfaces.count

            interface = host.interfaces.first
            assert_equal primary_id, interface.id
            assert_equal 'enp3s0', interface.identifier
            assert_equal '192.0.2.30', interface.ip
            assert_equal '02:00:00:00:00:30', interface.mac
            assert interface.primary?
            assert interface.provision?
            assert interface.execution
          end

          test 'with UUID reuses a primary interface without an identifier' do
            primary = @host.primary_interface
            primary.update!(identifier: nil, ip: '192.0.2.40', mac: '02:00:00:00:00:40', name: @host.name)
            primary_id = primary.id
            # interface_ids = @host.interfaces.pluck(:id).sort
            interface_ids = Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            params = host_params.merge(uuid: registration_uuid, remote_execution_interface: 'enp3s0')

            post :host, params: params, session: set_session_user

            assert_response :success
            assert_equal interface_ids, Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            host = @host.reload
            assert_equal interface_ids, host.interfaces.pluck(:id).sort
            assert_equal 1, host.interfaces.where(identifier: 'enp3s0').count
            primary = host.primary_interface
            assert_equal primary_id, primary.id
            assert_equal 'enp3s0', primary.identifier
            assert_equal '192.0.2.40', primary.ip
            assert_equal '02:00:00:00:00:40', primary.mac
            assert_equal host.name, primary.name
            assert primary.primary?
            assert primary.provision?
            assert primary.execution
          end

          test 'with UUID selects an already identified primary without creating a second interface' do
            primary = @host.primary_interface
            primary.update!(identifier: 'enp3s0', ip: '192.0.2.50', mac: '02:00:00:00:00:50', name: @host.name)
            primary_id = primary.id
            # interface_ids = @host.interfaces.pluck(:id).sort
            interface_ids = Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            params = host_params.merge(uuid: registration_uuid, remote_execution_interface: 'enp3s0')

            post :host, params: params, session: set_session_user

            assert_response :success
            assert_equal interface_ids, Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            host = @host.reload
            assert_equal interface_ids, host.interfaces.pluck(:id).sort
            assert_equal 1, host.interfaces.where(identifier: 'enp3s0').count
            primary = host.primary_interface
            assert_equal primary_id, primary.id
            assert_equal '192.0.2.50', primary.ip
            assert_equal '02:00:00:00:00:50', primary.mac
            assert_equal host.name, primary.name
            assert primary.execution
          end

          test 'with UUID selects an existing secondary interface instead of relabeling the primary' do
            primary = @host.primary_interface
            primary.update!(identifier: nil, ip: '192.0.2.70', mac: '02:00:00:00:00:70', name: @host.name)
            primary_id = primary.id
            secondary = FactoryBot.create(:nic_managed, host: @host, identifier: 'enp3s0', execution: false)
            secondary_id = secondary.id
            secondary_ip = secondary.ip
            secondary_mac = secondary.mac
            # interface_ids = @host.interfaces.pluck(:id).sort
            interface_ids = Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            params = host_params.merge(uuid: registration_uuid, remote_execution_interface: 'enp3s0')

            post :host, params: params, session: set_session_user

            assert_response :success
            assert_equal interface_ids, Nic::Base.where(host_id: @host.id).order(:id).pluck(:id)
            host = @host.reload
            assert_equal interface_ids, host.interfaces.pluck(:id).sort
            assert_equal 1, host.interfaces.where(identifier: 'enp3s0').count
            primary = host.primary_interface
            assert_equal primary_id, primary.id
            assert_nil primary.identifier
            assert_equal '192.0.2.70', primary.ip
            assert_equal '02:00:00:00:00:70', primary.mac
            assert_equal host.name, primary.name
            refute primary.execution
            secondary = host.interfaces.find_by!(identifier: 'enp3s0')
            assert_equal secondary_id, secondary.id
            assert_equal secondary_ip, secondary.ip
            assert_equal secondary_mac, secondary.mac
            assert secondary.execution
          end

          test 'with UUID creates a separate REX interface when the primary is identified differently' do
            primary = @host.primary_interface
            primary.update!(identifier: 'primary0', ip: '192.0.2.20', mac: '02:00:00:00:00:20', name: @host.name)
            primary_id = primary.id
            interface_count = @host.interfaces.count
            params = host_params.merge(uuid: registration_uuid, remote_execution_interface: 'enp3s0')

            post :host, params: params, session: set_session_user

            assert_response :success
            host = @host.reload
            assert_equal interface_count + 1, host.interfaces.count
            primary = host.primary_interface
            assert_equal primary_id, primary.id
            assert_equal 'primary0', primary.identifier
            assert_equal host.name, primary.name
            assert_equal '192.0.2.20', primary.ip
            assert_equal '02:00:00:00:00:20', primary.mac
            refute primary.execution

            execution_interface = host.interfaces.find_by!(identifier: 'enp3s0')
            refute_equal primary_id, execution_interface.id
            refute execution_interface.primary?
            assert_kind_of Nic::Managed, execution_interface
            assert execution_interface.execution
            assert_equal 1, host.interfaces.where(identifier: 'enp3s0').count
          end

          test 'with UUID does not create another interface when registration is repeated' do
            primary = @host.primary_interface
            primary.update!(identifier: nil, ip: '192.0.2.60', mac: '02:00:00:00:00:60', name: @host.name)
            primary_id = primary.id
            params = host_params.merge(uuid: registration_uuid, remote_execution_interface: 'enp3s0')

            post :host, params: params, session: set_session_user
            assert_response :success
            host = @host.reload
            interface_ids = host.interfaces.pluck(:id).sort

            post :host, params: params, session: set_session_user

            assert_response :success
            host.reload
            assert_equal interface_ids, host.interfaces.pluck(:id).sort
            assert_equal 1, host.interfaces.where(identifier: 'enp3s0').count
            primary = host.primary_interface
            assert_equal primary_id, primary.id
            assert_equal 'enp3s0', primary.identifier
            assert_equal '192.0.2.60', primary.ip
            assert_equal '02:00:00:00:00:60', primary.mac
            assert_equal host.name, primary.name
            assert primary.execution
          end
        end
      end
    end
  end
end
