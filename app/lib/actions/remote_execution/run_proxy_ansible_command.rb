module Actions
  module RemoteExecution
    class RunProxyAnsibleCommand < Actions::ProxyAction
      def plan(proxy, inventory, playbook, options = {})
        options = { :effective_user => nil }.merge(options)
        options.merge!(:inventory => inventory, :playbook => playbook)
        super(proxy, options)
      end

      def proxy_action_name
        'Proxy::Ansible::Command::Playbook::Action'
      end

      def on_data(data)
        result_event_hosts(data).each do |host, events|
          if step = host_step(host)
            world.event(step.execution_plan_id,
                        step.id,
                        ::Actions::ProxyAction::CallbackData.new(events))
          end
        end
        super(data)
      end

      def host_step(host_name)
        @host_steps ||= {}
        return @host_steps[host_name] if @host_steps.key?(host_name)

        if sub_task = sub_task_for_host(host_name)
          @host_steps[host_name] = sub_task.execution_plan.entry_action.run_step
        end

        @host_steps[host_name]
      end

      private

      def result_events(data)
        data['result'].select { |result| result["output_type"] == "event" }
      end

      def result_event_hosts(data)
        result_events(data).group_by { |result| result["output"]["host"] }
      end

      def sub_task_for_host(host_name)
        task.parent_task.sub_tasks.
          for_resource(Host.find_by_name(host_name)).first
      end
    end
  end
end
