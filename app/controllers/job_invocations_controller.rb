class JobInvocationsController < ApplicationController
  include ::Foreman::Controller::AutoCompleteSearch
  include ::ForemanTasks::Concerns::Parameters::Triggering

  def new
    ui_params = {
      :host_ids => params[:host_ids],
      :targeting => {
        :targeting_type => Targeting::STATIC_TYPE,
        :bookmark_id => params[:bookmark_id]
      }
    }

    if (template = JobTemplate.find_by(id: params[:template_id]))
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
    @composer = JobInvocationComposer.from_job_invocation(job_invocation, params)
    render :action => 'new'
  end

  def create
    @composer = prepare_composer
    if @composer.trigger
      redirect_to job_invocation_path(@composer.job_invocation)
    else
      @composer.job_invocation.description_format = nil if params.fetch(:job_invocation, {}).key?(:description_override)
      render :action => 'new'
    end
  end

  def show
    @job_invocation = resource_base.includes(:template_invocations => :run_host_job_task).find(params[:id])
    @auto_refresh = @job_invocation.task.try(:pending?)
    hosts_base = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
                                .joins(:template_invocations)
                                .merge(TemplateInvocation.where(:job_invocation_id => @job_invocation.id))
    @hosts = hosts_base.search_for(params[:search], :order => params[:order] || 'name ASC').paginate(:page => params[:page])
  end

  def index
    @job_invocations = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page]).with_task.order('job_invocations.id DESC')
  end

  # refreshes the form
  def refresh
    params[:job_invocation].delete :description_format if params[:job_invocation].key?(:description_override)
    @composer = prepare_composer
  end

  def preview_hosts
    composer = prepare_composer

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

  def prepare_composer
    if params[:feature].present?
      JobInvocationComposer.for_feature(params[:feature], params[:host_ids], {})
    else
      JobInvocationComposer.from_ui_params(params.merge(:triggering => triggering_params))
    end
  end
end
