module Actions
  module RemoteExecution
    class HostRun < Actions::ProxyAction

      include ::Dynflow::Action::Cancellable

      def plan(proxy, hostname, script, options = {})
        options = { :effective_user => nil }.merge(options)
        super(proxy, options.merge(:hostname => hostname, :script => script))
      end

      def proxy_action_name
        'Proxy::RemoteExecution::Ssh::CommandAction'
      end

      def on_data(data)
        super(data)
        error! _("Script execution failed") if failed_run?
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Skip
      end

      def failed_run?
        proxy_output.nil? || proxy_output[:exit_status] != 0
      end
    end
  end
end
