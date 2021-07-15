require 'test_plugin_helper'

class ForemanRemoteExecutionHostExtensionsTest < ActiveSupport::TestCase
  let(:provider) { 'SSH' }

  before { User.current = FactoryBot.build(:user, :admin) }
  after { User.current = nil }

  describe 'ssh specific params' do
    let(:host) { FactoryBot.create(:host, :with_execution) }
    let(:sshkey) { 'ssh-rsa AAAAB3NzaC1yc2EAAAABJQ foo@example.com' }

    before do
      SmartProxy.any_instance.stubs(:pubkey).returns(sshkey)
      Setting[:remote_execution_ssh_user] = 'root'
      Setting[:remote_execution_effective_user_method] = 'sudo'
    end

    it 'has ssh user in the parameters' do
      _(host.host_param('remote_execution_ssh_user')).must_equal Setting[:remote_execution_ssh_user]
    end

    it 'can override ssh user' do
      host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_user', :value => 'amy')
      _(host.host_param('remote_execution_ssh_user')).must_equal 'amy'
    end

    it 'has effective user method in the parameters' do
      _(host.host_param('remote_execution_effective_user_method')).must_equal Setting[:remote_execution_effective_user_method]
    end

    it 'can override effective user method' do
      host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_effective_user_method', :value => 'su')
      _(host.host_param('remote_execution_effective_user_method')).must_equal 'su'
    end

    it 'has ssh keys in the parameters' do
      _(host.remote_execution_ssh_keys).must_include sshkey
    end

    it 'merges ssh keys from host parameters and proxies' do
      key = 'ssh-rsa not-even-a-key something@somewhere.com'
      host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_keys', :value => [key])
      _(host.host_param('remote_execution_ssh_keys')).must_include key
      _(host.host_param('remote_execution_ssh_keys')).must_include sshkey
    end

    it 'merges ssh key as a string from host parameters and proxies' do
      key = 'ssh-rsa not-even-a-key something@somewhere.com'
      host.host_parameters << FactoryBot.create(:host_parameter, :host => host, :name => 'remote_execution_ssh_keys', :value => key)
      _(host.host_param('remote_execution_ssh_keys')).must_include key
      _(host.host_param('remote_execution_ssh_keys')).must_include sshkey
    end

    it 'has ssh keys in the parameters even when no user specified' do
      # this is a case, when using the helper in provisioning templates
      FactoryBot.create(:smart_proxy, :ssh)
      host.interfaces.first.subnet.remote_execution_proxies.clear
      User.current = nil
      _(host.remote_execution_ssh_keys).must_include sshkey
    end
  end

  context 'host has multiple nics' do
    let(:host) { FactoryBot.build(:host, :with_execution) }

    it 'should only have one execution interface' do
      host.interfaces << FactoryBot.build(:nic_managed)
      host.interfaces.each { |interface| interface.execution = true }
      _(host).wont_be :valid?
    end

    it 'returns the execution interface' do
      _(host.execution_interface).must_be_kind_of Nic::Managed
    end
  end

  context 'scoped search' do
    let(:job) do
      job = FactoryBot.create(:job_invocation, :with_task)
      job.template_invocations << FactoryBot.create(:template_invocation, :with_host, :with_failed_task)
      job
    end

    let(:job2) do
      job = FactoryBot.create(:job_invocation, :with_task)
      job.template_invocations << FactoryBot.create(:template_invocation, :with_host, :with_failed_task)
      job
    end

    it 'finds hosts for job_invocation.id' do
      found_ids = Host.search_for("job_invocation.id = #{job.id}").map(&:id).sort
      _(found_ids).must_equal job.template_invocations_host_ids.sort
    end

    it 'finds hosts by job_invocation.result' do
      success, failed = job.template_invocations
                           .partition { |template| template.run_host_job_task.result == 'success' }
      found_ids = Host.search_for('job_invocation.result = success').map(&:id)
      _(found_ids).must_equal success.map(&:host_id)
      found_ids = Host.search_for('job_invocation.result = failed').map(&:id)
      _(found_ids).must_equal failed.map(&:host_id)
    end

    it 'finds hosts by job_invocation.id and job_invocation.result' do
      # Force evaluation of the jobs
      job
      job2

      _(Host.search_for("job_invocation.id = #{job.id}").count).must_equal 2
      _(Host.search_for("job_invocation.id = #{job2.id}").count).must_equal 2
      _(Host.search_for('job_invocation.result = success').count).must_equal 2
      _(Host.search_for('job_invocation.result = failed').count).must_equal 2

      success, failed = job.template_invocations
                           .partition { |template| template.run_host_job_task.result == 'success' }
      found_ids = Host.search_for("job_invocation.id = #{job.id} AND job_invocation.result = success").map(&:id)
      _(found_ids).must_equal success.map(&:host_id)
      found_ids = Host.search_for("job_invocation.id = #{job.id} AND job_invocation.result = failed").map(&:id)
      _(found_ids).must_equal failed.map(&:host_id)
    end
  end

  describe 'proxy determination strategies' do
    context 'subnet strategy' do
      let(:host) { FactoryBot.build(:host, :with_execution) }
      it { host.remote_execution_proxies(provider)[:subnet].must_include host.subnet.remote_execution_proxies.first }
    end

    context 'fallback strategy' do
      let(:host) { FactoryBot.build(:host, :with_tftp_subnet) }

      context 'enabled' do
        before do
          Setting[:remote_execution_fallback_proxy] = true
          host.subnet.tftp.features << FactoryBot.create(:feature, :ssh)
        end

        it 'returns a fallback proxy' do
          host.remote_execution_proxies(provider)[:fallback].must_include host.subnet.tftp
        end
      end

      context 'disabled' do
        before do
          Setting[:remote_execution_fallback_proxy] = false
          host.subnet.tftp.features << FactoryBot.create(:feature, :ssh)
        end

        it 'returns no proxy' do
          host.remote_execution_proxies(provider)[:fallback].must_be_empty
        end
      end
    end

    context 'global strategy' do
      let(:tax_organization) { FactoryBot.build(:organization) }
      let(:tax_location) { FactoryBot.build(:location) }
      let(:host) { FactoryBot.build(:host, :organization => tax_organization, :location => tax_location) }
      let(:proxy_in_taxonomies) { FactoryBot.create(:smart_proxy, :ssh, :organizations => [tax_organization], :locations => [tax_location]) }
      let(:proxy_no_taxonomies) { FactoryBot.create(:smart_proxy, :ssh) }

      context 'enabled' do
        before { Setting[:remote_execution_global_proxy] = true }

        it 'returns correct proxies confined by taxonomies' do
          proxy_in_taxonomies
          proxy_no_taxonomies
          host.remote_execution_proxies(provider)[:global].must_include proxy_in_taxonomies
          host.remote_execution_proxies(provider)[:global].wont_include proxy_no_taxonomies
        end
      end

      context 'disabled' do
        before { Setting[:remote_execution_global_proxy] = false }
        it 'returns no proxy' do
          host.remote_execution_proxies(provider)[:global].must_be_empty
        end
      end
    end
  end
end
