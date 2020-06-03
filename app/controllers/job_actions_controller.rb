class JobActionsController < ::ApplicationController
  before_action :find_resource, :only => [:show, :update, :destroy]

  def index
    @job_actions = resource_scope
  end

  def new
    @job_action = JobAction.new(params.permit(:name, :job_template_id))
  end

  def create
    @job_action = JobAction.new(job_action_params)
    @job_action.save ? process_success : process_error
  end

  def show
  end

  def update
    @job_action.update(job_action_params) ? process_success : process_error
  end

  def destroy
    @job_action.destroy ? process_success : process_error
  end

  private

  def job_action_params
    params.require(:job_action).permit(:name, :job_template_id)
  end
end
