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
    render :action => 'new'
  end

  def create
    @composer = JobInvocationComposer.new.compose_from_params(params)
    if @composer.save
      @task = ForemanTasks.async_task(::Actions::RemoteExecution::RunHostsJob, @composer.job_invocation)
      redirect_to job_invocation_path(@composer.job_invocation)
    else
      render :action => 'new'
    end
  end

  def show
    @job_invocation = resource_base.find(params[:id])
  end

  def index
    @job_invocations = resource_base.search_for(params[:search]).paginate(:page => params[:page]).order('id DESC')
  end

  # refreshes the form
  def refresh
    @composer = JobInvocationComposer.new.composer_from_params(params)
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
