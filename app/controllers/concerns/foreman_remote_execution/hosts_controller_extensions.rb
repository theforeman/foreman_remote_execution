module ForemanRemoteExecution
  module HostsControllerExtensions
    extend ActiveSupport::Concern
    include Foreman::Renderer

    included do
      alias_method_chain(:action_permission, :remote_execution)
    end

    def reprovision
      find_resource
      script_template = @host.provisioning_template(:kind => 'script')
      if script_template.nil?
        process_error :redirect => :back, :error_msg => _("No script provisioning template available")
        return
      end
      @host.setBuild
      script = unattended_render(script_template.template, @template_name)
      composer = JobInvocationComposer.for_feature(:reprovision, @host, :script => script)
      composer.save!
      composer.trigger
      process_success :success_msg => _("Reprovision job started. The host should reboot soon."), :success_redirect => :back
    end

    private

    def action_permission_with_remote_execution
      case params[:action]
      when 'reprovision'
        :edit_host
      else
        action_permission_without_remote_execution
      end
    end
  end
end
