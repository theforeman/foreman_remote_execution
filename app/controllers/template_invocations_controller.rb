class TemplateInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch
  include RemoteExecutionHelper
  include JobInvocationsHelper

  before_action :find_job_invocation, :only => [:show_template_invocation_by_host, :list_jobs_hosts]
  before_action :find_host, :only => [:show_template_invocation_by_host]

  def controller_permission
    'job_invocations'
  end

  def show
    @template_invocation = TemplateInvocation.find(params[:id])
    raise ActiveRecord::RecordNotFound unless User.current.can?(:view_job_invocations, @template_invocation.job_invocation)

    @template_invocation_task = @template_invocation.run_host_job_task
    @host = @template_invocation.host
    @auto_refresh = @template_invocation_task.pending?
    @since = params[:since].to_f if params[:since].present?
    @line_sets = @template_invocation_task.main_action.live_output
    @line_sets = @line_sets.drop_while { |o| o['timestamp'].to_f <= @since } if @since
    @line_counter = params[:line_counter].to_i
  end

  def list_jobs_hosts
    hosts = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
    hosts = hosts.search_for(params[:search])
    template_invocations_task_by_hosts = {}
    hosts.each do |host|
      template_invocation = @job_invocation.template_invocations.find { |template_inv| template_inv.host_id == host.id }
      next unless template_invocation
      template_invocation_task = template_invocation.run_host_job_task
      template_invocations_task_by_hosts[host.id] =
        {
          :host_name => host.name,
          :id => host.id,
          :task => template_invocation_task.attributes.merge({cancellable: template_invocation_task.cancellable? }),
          :permissions => {
            :view_foreman_tasks => authorized_for(:permission => :view_foreman_tasks, :auth_object => template_invocation_task),
            :cancel_job_invocations => authorized_for(:permission => :cancel_job_invocations, :auth_object => @job_invocation),
            :execute_jobs => authorized_for(controller: :job_invocations, action: :create) && (!host.infrastructure_host? || User.current.can?(:execute_jobs_on_infrastructure_hosts)),
          },
        }
    end

    render json: {
      :template_invocations_task_by_hosts => template_invocations_task_by_hosts,
    }
  end

  def show_template_invocation_by_host
    @template_invocation = @job_invocation.template_invocations.find { |template_inv| template_inv.host_id == @host.id }
    if @template_invocation.nil?
      render :json => { :error => _('Template invocation not found') }, :status => :not_found
    end
    @template_invocation_task = @template_invocation.run_host_job_task
    lines = normalize_line_sets(@template_invocation_task.main_action.live_output)
    transformed_input_values = @template_invocation.input_values.joins(:template_input).map do |input_value|
      {
        name: input_value&.template_input&.name,
        value: input_safe_value(input_value),
      }
    end

    smart_proxy = @template_invocation.smart_proxy
    if smart_proxy
      proxy = {
        name: smart_proxy.name,
        href: smart_proxy_path(smart_proxy),
      }
    end

    auto_refresh = @job_invocation.task.try(:pending?)
    finished = @job_invocation.status_label == 'failed' || @job_invocation.status_label == 'succeeded' || @job_invocation.status_label == 'cancelled'
    render :json => { :output => lines, :preview => template_invocation_preview(@template_invocation, @host), :proxy => proxy, :input_values => transformed_input_values, :job_invocation_description => @job_invocation.description, :task => @template_invocation_task.attributes.merge({cancellable: @template_invocation_task.cancellable? }), :host_name => @host.name, :permissions => {
      :view_foreman_tasks => User.current.allowed_to?(:view_foreman_tasks),
      :cancel_job_invocations => User.current.allowed_to?(:cancel_job_invocations),
      :execute_jobs => User.current.allowed_to?(:create_job_invocations) && (!@host.infrastructure_host? || User.current.can?(:execute_jobs_on_infrastructure_hosts)),

    },
    :auto_refresh => auto_refresh, :finished => finished}, status: :ok
  end

  private

  def find_job_invocation
    @job_invocation = JobInvocation.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render :json => { :error => { :message => format(_("Job with id '%{id}' was not found"), :id => params['id']) } }, :status => :not_found
  end

  def find_host
    @host = Host.find(params[:host_id])
  rescue ActiveRecord::RecordNotFound
    render :json => { :error => { :message => format(_("Host with id '%{id}' was not found"), :id => params['host_id']) } }, :status => :not_found
  end

  def template_invocation_preview(template_invocation, host)
    renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
    output = load_template_from_task(template_invocation, host) || renderer.preview
    if output
      {:plain => output}
    else
      {status: :bad_request,
        plain: renderer.error_message }
    end
  end

end
