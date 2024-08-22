class CockpitController < ApplicationController
  before_action :find_resource, :only => [:host_ssh_params]

  def host_ssh_params
    render :json => SSHExecutionProvider.ssh_params(@host)
  end

  def redirect
    return invalid_request unless params[:redirect_uri]

    redir_url = URI.parse(params[:redirect_uri])

    cockpit_url = SSHExecutionProvider.cockpit_url_for_host('')
    redir_url.fragment = if redir_url.hostname == URI.join(Setting[:foreman_url], cockpit_url).hostname
                           "access_token=#{request.session_options[:id]}"
                         else
                           "error_description=Sorry"
                         end
    redirect_to(redir_url.to_s)
  end

  private

  def resource_name
    "host"
  end

  def controller_permission
    :hosts
  end

  def action_permission
    :cockpit
  end
end
