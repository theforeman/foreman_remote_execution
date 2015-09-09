class TemplateInvocationsController < ApplicationController
  def controller_permission
    'job_invocations'
  end

  def show
    @template_invocation_task = ForemanTasks::Task.find(params[:id])
    @template_invocation = @template_invocation_task.locks.where(:resource_type => 'TemplateInvocation').first.try(:resource)
    @host = @template_invocation_task.locks.where(:resource_type => 'Host::Managed').first.try(:resource)

    respond_to do |format|
      format.html
      format.js do
        @lines = @template_invocation_task.main_action.output
        if params[:since]
          @lines = @lines.select { |o| o['timestamp'].to_f > params[:since].to_f }
        end
      end
    end
  end
end
