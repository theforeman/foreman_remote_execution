module Actions
  module RemoteExecution
    module EventHelpers
      module ClassEventHelpers
        def event_states
          []
        end

        def event_names
          event_states.map do |state|
            event_name_base + '_' + event_name_suffix(state).to_s
          end
        end

        def feature_job_event_names(label)
          event_states.map do |state|
            ::Foreman::Observable.event_name_for("#{event_name_base}_#{label}_#{event_name_suffix(state)}")
          end
        end
      end

      def self.included(base)
        # Added by default by ObservableAction
        base.execution_plan_hooks.do_not_use :emit_event, :on => :success
        base.extend ClassEventHelpers
      end

      def emit_event(execution_plan, hook)
        return unless root_action?

        payload = event_payload(execution_plan)
        base = self.class.event_name_base
        suffix = self.class.event_name_suffix(hook)
        if input["job_features"]&.any?
          input['job_features'].each do |feature|
            name = "#{base}_#{feature}_#{suffix}"
            trigger_hook name, payload: payload
          end
        end
        trigger_hook("#{base}_#{suffix}", payload: payload)
      end
    end
  end
end
