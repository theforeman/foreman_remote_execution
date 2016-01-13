class TemplateInvocationsController < ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  def controller_permission
    'job_invocations'
  end

  def show
    @template_invocation = TemplateInvocation.find(params[:id])
    @template_invocation_task = @template_invocation.run_host_job_task
    @host = @template_invocation.host
    @auto_refresh = @template_invocation_task.pending?
    @since = params[:since].to_f if params[:since].present?
    @line_sets = @template_invocation_task.main_action.live_output
    @line_sets = @line_sets.drop_while { |o| o['timestamp'].to_f <= @since } if @since
    @line_counter = params[:line_counter].to_i
  end
end
