require 'test_plugin_helper'

module ForemanRemoteExecution
  class RunHostJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    let(:action) do
      create_action(Actions::RemoteExecution::RunHostJob)
    end

    describe '#find_ip_or_hostname' do
      let(:host) { FactoryGirl.create(:host) }
      let(:flags) do
        { :primary => false, :provision => false, :execution => false }
      end

      it 'finds hostname' do
        host.expects(:fqdn).returns('somehost.somedomain.org')
        action.send(:find_ip_or_hostname, host).must_equal 'somehost.somedomain.org'
      end

      it 'gets ip from unflagged interfaces' do
        ip = '127.0.0.1'
        host.interfaces = [FactoryGirl.build(:nic_managed, flags.merge(:ip => nil)),
                           FactoryGirl.build(:nic_managed, flags.merge(:ip => ip))]
        action.send(:find_ip_or_hostname, host).must_equal ip
      end

      it 'gets ip from flagged interfaces' do
        unflagged_interface = FactoryGirl.build(:nic_managed, flags)
        host.interfaces = [unflagged_interface]
        action.send(:find_ip_or_hostname, host).must_equal unflagged_interface.ip

        provision_interface = FactoryGirl.build(:nic_managed, flags.merge(:provision => true))
        host.interfaces << provision_interface
        action.send(:find_ip_or_hostname, host).must_equal provision_interface.ip

        primary_interface = FactoryGirl.build(:nic_managed, flags.merge(:primary => true))
        host.interfaces << primary_interface
        # Workaround, execution flag got enabled when adding the interface to the host
        host.interfaces.last.execution = false
        action.send(:find_ip_or_hostname, host).must_equal primary_interface.ip

        execution_interface = FactoryGirl.build(:nic_managed, flags.merge(:execution => true))
        host.interfaces << execution_interface
        action.send(:find_ip_or_hostname, host).must_equal execution_interface.ip
      end
    end
  end
end
