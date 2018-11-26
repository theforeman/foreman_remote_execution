module Concerns::ForemanRemoteExecution::Api::V2::HostsControllerExtensions
  extend Apipie::DSL::Concern

  api :GET, '/hosts/:id/ssh_params', N_('Get default parameters for SSH to a host')
  def ssh_params
    render :json => SSHExecutionProvider.ssh_params(@host)
  end

  protected

  def action_permission
    case params[:action]
    when 'ssh_params'
      'view'
    else
      super
    end
  end
end
