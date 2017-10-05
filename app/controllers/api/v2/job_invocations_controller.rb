module Api
  module V2
    class JobInvocationsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Api::TaxonomyScope
      include ::Foreman::Renderer

      before_action :find_optional_nested_object
      before_action :find_host, :only => %w{output}
      before_action :find_resource, :only => %w{show update destroy clone}
      before_action :validate_template, :only => :create

      wrap_parameters JobInvocation, :include => (JobInvocation.attribute_names + [:ssh])

      api :GET, '/job_invocations/', N_('List job invocations')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @job_invocations = resource_scope_for_index
      end

      api :GET, '/job_invocations/:id', N_('Show job invocation')
      param :id, :identifier, :required => true
      def show; end

      # rubocop:disable Metrics/BlockLength
      def_param_group :job_invocation do
        param :job_invocation, Hash, :required => true, :action_aware => true do
          param :job_template_id, String, :required => true, :desc => N_('The job template to use')
          param :targeting_type, String, :required => true, :desc => N_('Invocation type, one of %s') % Targeting::TYPES
          param :inputs, Hash, :required => false, :desc => N_('Inputs to use')
          param :ssh, Hash, :desc => N_('SSH provider specific options') do
            param :effective_user, String,
                  :required => false,
                  :desc => N_('What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.')
          end

          param :recurrence, Hash, :desc => N_('Create a recurring job') do
            param :cron_line, String, :required => false, :desc => N_('How often the job should occur, in the cron format')
            param :max_iteration, :number, :required => false, :desc => N_('Repeat a maximum of N times')
            param :end_time, DateTime, :required => false, :desc => N_('Perform no more executions after this time')
          end

          param :scheduling, Hash, :desc => N_('Schedule the job to start at a later time') do
            param :start_at, DateTime, :required => false, :desc => N_('Schedule the job for a future time')
            param :start_before, DateTime, :required => false, :desc => N_('Indicates that the action should be cancelled if it cannot be started before this time.')
          end

          param :concurrency_control, Hash, :desc => N_('Control concurrency level and distribution over time') do
            param :time_span, Integer, :desc => N_('Distribute tasks over N seconds')
            param :concurrency_level, Integer, :desc => N_('Run at most N tasks at a time')
          end

          param :bookmark_id, Integer, :required => false
          param :search_query, Integer, :required => false
          param :description_format, String, :required => false, :desc => N_('Override the description format from the template for this invocation only')
          param :execution_timeout_interval, Integer, :required => false, :desc => N_('Override the timeout interval from the template for this invocation only')
        end
      end

      api :POST, '/job_invocations/', N_('Create a job invocation')
      param_group :job_invocation, :as => :create
      def create
        composer = JobInvocationComposer.from_api_params(job_invocation_params)
        composer.trigger!
        @job_invocation = composer.job_invocation
        process_response @job_invocation
      end

      api :GET, '/job_invocations/:id/hosts/:host_id', N_('Get output for a host')
      param :id, :identifier, :required => true
      param :host_id, :identifier, :required => true
      param :since, String, :required => false
      def output
        task = @nested_obj.sub_task_for_host(@host)
        refresh = task.pending?
        since = params[:since].to_f if params[:since].present?

        line_sets = task.main_action.live_output
        line_sets = line_sets.drop_while { |o| o['timestamp'].to_f <= since } if since

        if line_sets.blank?
          render :json => {:refresh => refresh, :output => []}
        else
          render :json => {:refresh => refresh, :output => line_sets }
        end
      end

      private

      def action_permission
        case params[:action]
        when 'output'
          :view
        else
          super
        end
      end

      def find_host
        @host = Host.authorized(:view_hosts).find(params['host_id'])
      rescue ActiveRecord::RecordNotFound
        not_found({ :error => { :message => (_("Host with id '%{id}' was not found") % { :id => params['host_id'] }) } })
      end

      def validate_template
        JobTemplate.authorized(:view_job_templates).find(job_invocation_params['job_template_id'])
      rescue ActiveRecord::RecordNotFound
        not_found({ :error => { :message => (_("Template with id '%{id}' was not found") % { :id => job_invocation_params['job_template_id'] }) } })
      end

      def job_invocation_params
        job_invocation_params = params.fetch(:job_invocation, {}).dup
        job_invocation_params.merge!(job_invocation_params.delete(:ssh)) if job_invocation_params.key?(:ssh)
        job_invocation_params
      end
    end
  end
end
