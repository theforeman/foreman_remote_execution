# frozen_string_literal: true

module Api
  module V2
    class TemplateInvocationsController < ::Api::V2::BaseController
      include RemoteExecutionHelper

      before_action :find_job_invocation, :only => %w{template_invocations}

      api :GET, '/job_invocations/:job_invocation_id/template_invocations',
        N_('List template invocations belonging to job invocation')
      param_group :search_and_pagination, ::Api::V2::BaseController
      param :job_invocation_id, :identifier, :required => true
      def template_invocations
        @template_invocations = resource_scope.paginate(paginate_options)
        render :layout => 'api/v2/layouts/index_layout'
      end

      def resource_scope
        if params[:action] == 'template_invocations'
          resource_scope_for_template_invocations
        else
          super
        end
      end

      api :GET, '/hosts/:host_id/job_invocation/:job_invocation_id/show_template_invocation/'
      param :host_id, :identifier, :required => true
      param :job_invocation_id, :identifier, :required => true
      def show_template_invocation_by_host
        @host = Host.find(params[:host_id])
        @job_invocation = JobInvocation.find(params[:job_invocation_id])
        if @host.nil?
          render :json => { :error => _('Host not found') }, :status => :bad_request
        end
        if @job_invocation.nil?
          render :json => { :error => _('Job invocation not found') }, :status => :bad_request
        end
        @template_invocation = @job_invocation.template_invocations.find { |template_inv| template_inv.host_id == @host.id }
        @template = TemplateInvocation.find(@template_invocation.id)
        if @template_invocation.nil? || @template.nil?
          render :json => { :error => _('Template invocation not found') }, :status => :bad_request
        end
        @template_invocation_task = @template_invocation.run_host_job_task

        lines = normalize_line_sets(@template_invocation_task.main_action.live_output)
        input_values_with_template_input = @template_invocation.input_values.joins(:template_input).as_json(include: :template_input)
        transformed_input_values = input_values_with_template_input.map do |input_value|
          template_input = input_value['template_input']
          value = template_input["hidden_value"] ? '*' * 5 : input_value["value"]
          {
            name: input_value['template_input']['name'],
            value: value,
          }
        end
        auto_refresh = @job_invocation.task.try(:pending?)
        finished = @job_invocation.status_label == 'failed' || @job_invocation.status_label == 'succeeded' || @job_invocation.status_label == 'cancelled'
        render :json => { :output => lines, :preview => template_invocation_preview(@template_invocation, @host), :input_values => transformed_input_values, :job_invocation_description => @job_invocation.description, :task_id => @template_invocation_task.id, :task_cancellable => @template_invocation_task.cancellable?, :host_name => @host.name, :permissions => {
          :view_foreman_tasks => User.current.allowed_to?(:view_foreman_tasks),
          :cancel_job_invocations => User.current.allowed_to?(:cancel_job_invocations),
          :execute_jobs => User.current.allowed_to?(:create_job_invocations) && (!@host.infrastructure_host? || User.current.can?(:execute_jobs_on_infrastructure_hosts)),

        },
        :auto_refresh => auto_refresh, :finished => finished}, status: :ok
      end

      private

      def template_invocation_preview(template_invocation, host)
        if host.nil?
          return {
            status: :bad_request,
            plain: _('Host not found'),
          }
        end
        if template_invocation.nil?
          return {
            status: :bad_request,
            plain: _('Template invocation not found'),
          }
        end
        renderer = InputTemplateRenderer.new(template_invocation.template, host, template_invocation)
        output = load_template_from_task(template_invocation, host) || renderer.preview
        if output
          {:plain => output}
        else
          {status: :bad_request,
            plain: renderer.error_message }
        end
      end

      def resource_scope_for_template_invocations
        @job_invocation.template_invocations
                       .includes(:host)
                       .where(host: Host.authorized(:view_hosts, Host))
                       .search_for(*search_options)
      end

      def find_job_invocation
        @job_invocation = JobInvocation.find(params[:id])
      end

      def action_permission
        case params[:action]
        when 'template_invocations', 'show_template_invocation_by_host'
          :view
        else
          super
        end
      end
    end
  end
end
