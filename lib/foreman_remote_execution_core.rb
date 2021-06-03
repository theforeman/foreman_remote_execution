module ForemanRemoteExecutionCore
  require 'smart_proxy_remote_execution_ssh'
  require 'foreman_remote_execution_core/actions'

  def self.settings
    Proxy::RemoteExecution::Ssh::Plugin.settings
  end
end
