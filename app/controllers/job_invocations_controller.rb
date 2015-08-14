class JobInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  def new
    @composer = JobInvocationComposer.new(JobInvocation.new,
                                          :host_ids => params[:host_ids],
                                          :targeting => {
                                            :targeting_type => Targeting::STATIC_TYPE,
                                            :bookmark_id => params[:bookmark_id]
                                          })
  end

  def create
    @composer = JobInvocationComposer.new(JobInvocation.new, params)
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
    @composer = JobInvocationComposer.new(JobInvocation.new, params)
  end
end
