class JobInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  def new
    @composer = JobInvocationComposer.new.compose_from_params(
      :host_ids => params[:host_ids],
      :targeting => {
        :targeting_type => Targeting::STATIC_TYPE,
        :bookmark_id => params[:bookmark_id]
      })
  end

  def rerun
    job_invocation = resource_base.find(params[:id])
    @composer = JobInvocationComposer.new.compose_from_invocation(job_invocation)

    if params[:failed_only]
      host_ids = job_invocation.failed_host_ids
      @composer.search_query = @composer.targeting.build_query_from_hosts(host_ids)
    end

    render :action => 'new'
  end

  def create
    @composer = JobInvocationComposer.new.compose_from_params(params)
    action = ::Actions::RemoteExecution::RunHostsJob
    if @composer.save
      job_invocation = @composer.job_invocation
      if job_invocation.trigger_mode == :future
        ForemanTasks.delay action,
                           job_invocation.delay_options,
                           job_invocation
      else
        ForemanTasks.async_task(action, job_invocation)
      end
      redirect_to job_invocation_path(job_invocation)
    else
      render :action => 'new'
    end
  end

  def show
    @job_invocation = resource_base.find(params[:id])
    @auto_refresh = @job_invocation.last_task.try(:pending?)
    hosts_base = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
    @hosts = hosts_base.search_for(params[:search], :order => params[:order] || 'name ASC').paginate(:page => params[:page])
  end

  def index
    @job_invocations = resource_base.search_for(params[:search]).paginate(:page => params[:page]).order('id DESC')
  end

  # refreshes the form
  def refresh
    @composer = JobInvocationComposer.new.compose_from_params(params)
  end

  private

  def action_permission
    case params[:action]
      when 'rerun'
        'create'
      else
        super
    end
  end
end
