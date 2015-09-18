module Actions
  module RemoteExecution
    class RunProxyCommand < Actions::ProxyAction

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
        exit_status && proxy_output[:exit_status] != 0
      end

      def exit_status
        proxy_output && proxy_output[:exit_status]
      end

      def live_output
        output = self.output[:proxy_output].present? ? self.output[:proxy_output] : fetch_output['output']
        output_records(output)
      end

      private

      def output_records(base_output)
        base_output['result']
      end

      def fetch_output
        proxy.status_of_task(output[:proxy_task_id])['actions'].detect { |action| action['class'] == proxy_action_name }
      end
    end
  end
end
