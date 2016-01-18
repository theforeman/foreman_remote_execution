module Api
  module V2
    class JobInvocationsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Api::TaxonomyScope
      include ::Foreman::Renderer

      before_filter :find_optional_nested_object
      before_filter :find_host, :only => %w{output}
      before_filter :find_resource, :only => %w{show update destroy clone}
      before_filter :validate_templates, :only => :create

      wrap_parameters JobInvocation, :include => (JobInvocation.attribute_names + [:ssh])

      api :GET, '/job_invocations/', N_('List job invocations')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @job_invocations = resource_scope_for_index
      end

      api :GET, '/job_invocations/:id', N_('Show job invocation')
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :job_invocation do
        param :job_invocation, Hash, :required => true, :action_aware => true do
          param :job_category, String, :required => true, :desc => N_('Job category')
          param :job_template_id, String, :required => false, :desc => N_('If using a specific template, the id of that template.')
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

          param :bookmark_id, Integer, :required => false
          param :search_query, Integer, :required => false
          param :description_format, String, :required => false, :desc => N_('Override the description format from the template for this invocation only')
        end
      end

      api :POST, '/job_invocations/', N_('Create a job invocation')
      param_group :job_invocation, :as => :create
      def create
        composer = JobInvocationComposer.from_api_params(job_invocation_params)
        composer.save!
        composer.trigger
        process_response composer.job_invocation
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
        @host = Host::Base.authorized(:view_hosts).find(params['host_id'])
      rescue ActiveRecord::RecordNotFound
        not_found({ :error => { :message => (_("Host with id '%{id}' was not found") % { :id => params['host_id'] }) } })
      end

      def validate_templates
        templates = []
        if job_invocation_params[:job_template_id]
          templates << JobTemplate.find(job_invocation_params[:job_template_id])
        else
          templates = JobTemplate.where(:job_category => job_invocation_params[:job_category])
          if templates.pluck(:provider_type).uniq.length != templates.length
            raise Foreman::Exception, _('Duplicate remote execution providers found for specified Job, please specify a single job_template_id.')
          end
        end

        raise Foreman::Exception, _('No templates associated with specified Job Name') if templates.empty?
      end

      def job_invocation_params
        job_invocation_params = params.fetch(:job_invocation, {}).dup
        job_invocation_params.merge!(job_invocation_params.delete(:ssh)) if job_invocation_params.key?(:ssh)
        job_invocation_params
      end
    end
  end
end
