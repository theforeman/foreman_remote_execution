module ForemanRemoteExecutionCore
  module Actions
    require 'smart_proxy_remote_execution_ssh/actions/run_script'
    RunScript = Proxy::RemoteExecution::Ssh::Actions::RunScript
  end
end
