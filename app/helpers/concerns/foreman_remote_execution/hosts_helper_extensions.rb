module ForemanRemoteExecution
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain(:host_title_actions, :run_button)
      alias_method_chain :multiple_actions, :remote_execution
    end

    def multiple_actions_with_remote_execution
      multiple_actions_without_remote_execution + [ [_('Schedule Remote Job'), new_job_invocation_path, false] ]
    end

    def schedule_job_multi_button(*args)
      host_features = RemoteExecutionFeature.with_host_action_button.order(:label).map do |feature|
        link_to(_('%s') % feature.name, job_invocations_path(:host_ids => [args.first.id], :feature => feature.label), :method => :post)
      end

      if host_features.present?
        action_buttons(schedule_job_button(*args), *host_features)
      else
        schedule_job_button(*args)
      end
    end

    def schedule_job_button(*args)
      link_to(_('Schedule Remote Job'), new_job_invocation_path(:host_ids => [args.first.id]), :id => :run_button, :class => 'btn btn-default')
    end

    def host_title_actions_with_run_button(*args)
      title_actions(button_group(schedule_job_multi_button(*args)))
      host_title_actions_without_run_button(*args)
    end
  end
end
