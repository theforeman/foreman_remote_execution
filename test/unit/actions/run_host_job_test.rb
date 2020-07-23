require 'test_plugin_helper'

module ForemanRemoteExecution
  class RunHostJobTest < ActiveSupport::TestCase
    include Dynflow::Testing

    subject { create_action(Actions::RemoteExecution::RunHostJob) }

    describe '#secrets' do
      let(:job_invocation) { FactoryBot.create(:job_invocation, :with_task) }
      let(:host) { job_invocation.template_invocations.first.host }
      let(:provider) do
        provider = ::SSHExecutionProvider
        provider.expects(:ssh_password).with(host).returns('sshpass')
        provider.expects(:effective_user_password).with(host).returns('sudopass')
        provider.expects(:ssh_key_passphrase).with(host).returns('keypass')
        provider
      end

      it 'uses provider secrets' do
        secrets = subject.secrets(host, job_invocation, provider)

        assert_equal 'sshpass', secrets[:ssh_password]
        assert_equal 'sudopass', secrets[:effective_user_password]
        assert_equal 'keypass', secrets[:key_passphrase]
      end

      it 'prefers job secrets over provider secrets' do
        job_invocation.password = 'jobsshpass'
        job_invocation.key_passphrase = 'jobkeypass'
        secrets = subject.secrets(host, job_invocation, provider)

        assert_equal 'jobsshpass', secrets[:ssh_password]
        assert_equal 'sudopass', secrets[:effective_user_password]
        assert_equal 'jobkeypass', secrets[:key_passphrase]
      end
    end

    describe '#finalize' do
      let(:host) { FactoryBot.create(:host, :with_execution) }

      before do
        subject.stubs(:input).returns({ host: { id: host.id } })
        Host.expects(:find).with(host.id).returns(host)
      end

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
