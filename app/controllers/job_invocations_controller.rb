class JobInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  def new
    ui_params = {
      :host_ids => params[:host_ids],
      :targeting => {
        :targeting_type => Targeting::STATIC_TYPE,
        :bookmark_id => params[:bookmark_id]
      }
    }

    if (template = JobTemplate.find_by_id(params[:template_id]))
      ui_params[:job_invocation] = {
        :job_category => template.job_category,
        :providers => {
          template.provider_type => {:job_template_id => template.id}
        }
      }
    end

    @composer = JobInvocationComposer.from_ui_params(ui_params)
  end

  def rerun
    job_invocation = resource_base.find(params[:id])
    @composer = JobInvocationComposer.from_job_invocation(job_invocation)
    if params[:failed_only]
      host_ids = job_invocation.failed_host_ids
      @composer.search_query = Targeting.build_query_from_hosts(host_ids)
    end

    render :action => 'new'
  end

  def create
    @composer = JobInvocationComposer.from_ui_params(params)
    if @composer.trigger
      redirect_to job_invocation_path(@composer.job_invocation)
    else
      @composer.job_invocation.description_format = nil if params[:job_invocation].key?(:description_override)
      render :action => 'new'
    end
  end

  def show
    @job_invocation = resource_base.includes(:template_invocations => :run_host_job_task).find(params[:id])
    @auto_refresh = @job_invocation.task.try(:pending?)
    hosts_base = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
    @hosts = hosts_base.search_for(params[:search], :order => params[:order] || 'name ASC').paginate(:page => params[:page])
  end

  def index
    @job_invocations = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page]).with_task.order('job_invocations.id DESC')
  end

  # refreshes the form
  def refresh
    params[:job_invocation].delete :description_format if params[:job_invocation].key?(:description_override)
    @composer = JobInvocationComposer.from_ui_params(params)
  end

  def preview_hosts
    composer = JobInvocationComposer.from_ui_params(params)

    @hosts = composer.targeted_hosts.limit(Setting[:entries_per_page])
    @additional = composer.targeted_hosts.count - Setting[:entries_per_page]
    @dynamic = composer.targeting.dynamic?
    @query = composer.displayed_search_query

    render :partial => 'job_invocations/preview_hosts_list'
  end

  private

  def action_permission
    case params[:action]
      when 'rerun'
        'create'
      when 'preview_hosts'
        'create'
      else
        super
    end
  end
end
