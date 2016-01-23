module Actions
  module RemoteExecution
    module SSH
      class RunProxyCommand < RunProxyCommand
        def plan(proxy, hostname, script, options = {})
          options = { :effective_user => nil }.merge(options)
          super(proxy, options.merge(:hostname => hostname, :script => script))
        end

        def proxy_action_name
          'Proxy::RemoteExecution::Ssh::CommandAction'
        end
      end
    end
  end
end
