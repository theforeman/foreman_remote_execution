class TemplateInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  def controller_permission
    'job_invocations'
  end

  def show
    @template_invocation_task = ForemanTasks::Task.find(params[:id])
    @template_invocation = @template_invocation_task.locks.where(:resource_type => 'TemplateInvocation').first.try(:resource)
    @host = @template_invocation_task.locks.where(:resource_type => 'Host::Managed').first.try(:resource)
    @auto_refresh = @template_invocation_task.pending?
    @since = params[:since].to_f if params[:since].present?
    @line_sets = @template_invocation_task.main_action.live_output
    @line_sets = @line_sets.drop_while { |o| o['timestamp'].to_f <= @since } if @since
    @line_counter = params[:line_counter].to_i
  end
end
