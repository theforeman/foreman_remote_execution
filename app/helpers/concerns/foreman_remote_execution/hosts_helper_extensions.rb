module ForemanRemoteExecution
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain(:host_title_actions, :run_button)
      alias_method_chain :multiple_actions, :remote_execution
    end

    def multiple_actions_with_remote_execution
      multiple_actions_without_remote_execution + [[_('Run Job'), new_job_invocation_path, false]]
    end

    def host_title_actions_with_run_button(*args)
      title_actions(button_group(link_to(_('Run Job'), new_job_invocation_path(:host_ids => [args.first.id]), :id => :run_button, :class => 'btn btn-default')))
      host_title_actions_without_run_button(*args)
    end
  end
end
