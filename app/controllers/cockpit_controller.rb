class CockpitController < ApplicationController
  before_action :find_resource, :only => [:host_ssh_params]

  def host_ssh_params
    render :json => ScriptExecutionProvider.ssh_params(@host)
  end

  def redirect
    return invalid_request unless params[:redirect_uri]

    begin
      redir_url = URI.parse(params[:redirect_uri])
    rescue URI::InvalidURIError
      return invalid_request
    end

    # Validate URL scheme to prevent javascript: or data: schemes
    return invalid_request unless %w[http https].include?(redir_url.scheme&.downcase)

    cockpit_url = ScriptExecutionProvider.cockpit_url_for_host('')
    expected_hostname = URI.join(Setting[:foreman_url], cockpit_url).hostname

    # Only redirect to expected hostname to prevent open redirects
    return invalid_request unless redir_url.hostname == expected_hostname

    redir_url.query = "access_token=#{request.session_options[:id]}"
    redirect_to(redir_url.to_s, allow_other_host: true)
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
