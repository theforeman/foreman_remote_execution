require 'test_plugin_helper'

module ForemanRemoteExecution
  class RunHostJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    subject { create_action(Actions::RemoteExecution::RunHostJob) }
    let(:host) { FactoryBot.create(:host, :with_execution) }

    before do
      subject.stubs(:input).returns({ host: { id: host.id } })
      Host.expects(:find).with(host.id).returns(host)
    end

    describe '#finalize' do
      describe 'updates the host status' do
        before do
          subject.expects(:check_exit_status).returns(nil)
        end

        context 'with stubbed status' do
          let(:stub_status) do
            status = HostStatus::ExecutionStatus.new
            status.stubs(:save!).returns(true)
            status
          end

          before do
            host.expects(:execution_status_object).returns(stub_status)
          end

          context 'exit_status is 0' do
            it 'updates the host status to OK' do
              subject.stubs(:exit_status).returns(0)
              stub_status.expects(:"status=").with(HostStatus::ExecutionStatus::OK)
              subject.finalize
            end
          end

          context 'exit_status is NOT 0' do
            it 'updates the host status to ERROR' do
              subject.stubs(:exit_status).returns(1)
              stub_status.expects(:"status=").with(HostStatus::ExecutionStatus::ERROR)
              subject.finalize
            end
          end
        end

        context 'host has no execution status yet' do
          before do
            assert_nil host.execution_status_object
            subject.stubs(:exit_status).returns(0)
          end

          it 'creates a new status' do
            subject.finalize
            assert_not_nil host.execution_status_object
          end
        end
      end
    end
  end
end
