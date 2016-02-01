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

    def host_title_actions_with_run_button(host)
      links = [link_to(_('Run Job'), new_job_invocation_path(:host_ids => [host.id]), :id => :run_button)]
      if RemoteExecutionFeature.feature(:reprovision).template && @host.provisioning_template(:kind => 'script')
        links << link_to(_('Reprovision'), reprovision_host_path(host.id), { :method => :post, :disabled =>  @host.build })
      end
      title_actions(button_group(*links))
      host_title_actions_without_run_button(host)
    end
  end
end
