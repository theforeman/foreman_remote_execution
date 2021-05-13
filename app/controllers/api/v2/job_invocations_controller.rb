module Api
  module V2
    class JobInvocationsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Renderer

      before_action :find_optional_nested_object, :only => %w{output raw_output}
      before_action :find_host, :only => %w{output raw_output}
      before_action :find_resource, :only => %w{show update destroy clone cancel rerun outputs}

      wrap_parameters JobInvocation, :include => (JobInvocation.attribute_names + [:ssh])

      api :GET, '/job_invocations/', N_('List job invocations')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @job_invocations = resource_scope_for_index
      end

      api :GET, '/job_invocations/:id', N_('Show job invocation')
      param :id, :identifier, :required => true
      param :host_status, :bool, required: false, desc: N_('Show Job status for the hosts')
      def show
        @hosts = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
        @template_invocations = @job_invocation.template_invocations
                                               .where(host: @hosts)
                                               .includes(:input_values)

        if params[:host_status] == 'true'
          template_invocations = @template_invocations.includes(:run_host_job_task).to_a
          @host_statuses = Hash[template_invocations.map { |ti| [ti.host_id, template_invocation_status(ti)] }]
        end
      end

      def_param_group :job_invocation do
        param :job_invocation, Hash, :required => true, :action_aware => true do
          param :job_template_id, String, :required => false, :desc => N_('The job template to use, parameter is required unless feature was specified')
          param :targeting_type, String, :required => true, :desc => N_('Invocation type, one of %s') % Targeting::TYPES
          param :randomized_ordering, :bool, :desc => N_('Execute the jobs on hosts in randomized order')
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
          param :search_query, String, :required => false
          param :description_format, String, :required => false, :desc => N_('Override the description format from the template for this invocation only')
          param :execution_timeout_interval, Integer, :required => false, :desc => N_('Override the timeout interval from the template for this invocation only')
          param :feature, String, :required => false, :desc => N_('Remote execution feature label that should be triggered, job template assigned to this feature will be used')

          RemoteExecutionProvider.providers.each_value do |provider|
            next if !provider.respond_to?(:provider_inputs_doc) || provider.provider_inputs_doc.empty?
            doc = provider.provider_inputs_doc
            param doc[:namespace], Hash, doc[:opts] do
              doc[:children].map do |input|
                param input[:name], input[:type], input[:opts]
              end
            end
          end
        end
      end

      api :POST, '/job_invocations/', N_('Create a job invocation')
      param_group :job_invocation, :as => :create
      def create
        composer = JobInvocationComposer.from_api_params(
          job_invocation_params
        )
        composer.trigger!
        @job_invocation = composer.job_invocation
        @hosts = @job_invocation.targeting.hosts
        process_response @job_invocation
      rescue JobInvocationComposer::JobTemplateNotFound, JobInvocationComposer::FeatureNotFound => e
        not_found(error: { message: e.message })
      end

      api :GET, '/job_invocations/:id/hosts/:host_id', N_('Get output for a host')
      param :id, :identifier, :required => true
      param :host_id, :identifier, :required => true
      param :since, String, :required => false
      def output
        if @nested_obj.task.scheduled?
          render :json => delayed_task_output(@nested_obj.task, :default => [])
          return
        end

        render :json => host_output(@nested_obj, @host, :default => [], :since => params[:since])
      end

      api :GET, '/job_invocations/:id/hosts/:host_id/raw', N_('Get raw output for a host')
      param :id, :identifier, :required => true
      param :host_id, :identifier, :required => true
      def raw_output
        if @nested_obj.task.scheduled?
          render :json => delayed_task_output(@nested_obj.task)
          return
        end

        render :json => host_output(@nested_obj, @host, :raw => true)
      end

      api :POST, '/job_invocations/:id/cancel', N_('Cancel job invocation')
      param :id, :identifier, :required => true
      param :force, :bool
      def cancel
        if @job_invocation.task.cancellable?
          result = @job_invocation.cancel(params.fetch('force', false))
          render :json => { :cancelled => result, :id => @job_invocation.id }
        else
          render :json => { :message => _('The job could not be cancelled.') },
                 :status => :unprocessable_entity
        end
      end

      api :POST, '/job_invocations/:id/rerun', N_('Rerun job on failed hosts')
      param :id, :identifier, :required => true
      param :failed_only, :bool
      def rerun
        composer = JobInvocationComposer.from_job_invocation(@job_invocation, params)
        if composer.rerun_possible?
          composer.trigger!
          @job_invocation = composer.job_invocation
          process_response @job_invocation
        else
          render :json => { :error => _('Could not rerun job %{id} because its template could not be found') % { :id => composer.reruns } },
                 :status => :not_found
        end
      end

      api :GET, '/job_invocations/:id/outputs', N_('Get outputs of hosts in a job')
      param :id, :identifier, :required => true
      param :search_query, :identifier, :required => false
      param :since, String, :required => false
      param :raw, String, :required => false
      def outputs
        hosts = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
        hosts = hosts.search_for(params['search_query']) if params['search_query']
        raw = ActiveRecord::Type::Boolean.new.cast params['raw']
        default_value = raw ? '' : []
        outputs = hosts.map do |host|
          host_output(@job_invocation, host, :default => default_value, :since => params['since'], :raw => raw)
            .merge(host_id: host.id)
        end

        render :json => { :outputs => outputs }
      end

      private

      def allowed_nested_id
        %w(job_invocation_id)
      end

      def action_permission
        case params[:action]
        when 'output', 'raw_output', 'outputs'
          :view
        when 'cancel'
          :cancel
        when 'rerun'
          :create
        else
          super
        end
      end

      def find_host
        @host = @nested_obj.targeting.hosts.authorized(:view_hosts, Host).find(params['host_id'])
      rescue ActiveRecord::RecordNotFound
        not_found({ :error => { :message => (_("Host with id '%{id}' was not found") % { :id => params['host_id'] }) } })
      end

      def job_invocation_params
        return @job_invocation_params if @job_invocation_params.present?

        job_invocation_params = params.fetch(:job_invocation, {}).dup

        if job_invocation_params[:feature].present? && job_invocation_params[:job_template_id].present?
          raise _("Only one of feature or job_template_id can be specified")
        end

        if job_invocation_params.key?(:ssh)
          job_invocation_params.merge!(job_invocation_params.delete(:ssh).permit(:effective_user))
        end

        job_invocation_params[:inputs] ||= {}
        job_invocation_params[:inputs].permit!
        permit_provider_inputs job_invocation_params
        @job_invocation_params = job_invocation_params
      end

      def permit_provider_inputs(invocation_params)
        providers = RemoteExecutionProvider.providers.values.reject { |provider| !provider.respond_to?(:provider_input_namespace) || provider.provider_input_namespace.empty? }
        providers.each { |provider| invocation_params[provider.provider_input_namespace]&.permit! }
      end

      def output_lines_since(task, time)
        since = time.to_f if time.present?
        line_sets = task.main_action.live_output
        line_sets = line_sets.drop_while { |o| o['timestamp'].to_f <= since } if since
        line_sets
      end

      def host_output(job_invocation, host, default: nil, since: nil, raw: false)
        refresh = !job_invocation.finished?

        if (task = job_invocation.sub_task_for_host(host))
          refresh = task.pending?
          output  = output_lines_since(task, since)
          output  = output.map { |set| set['output'] }.join if raw
        end

        { :complete => !refresh, :refresh => refresh, :output => output || default }
      end

      def delayed_task_output(task, default: nil)
        { :complete => false, :refresh => true, :output => default, :delayed => true, :start_at => task.start_at }
      end

      # Do not try to scope JobInvocations by taxonomies
      def parent_scope
        resource_class.where(nil)
      end

      def template_invocation_status(template_invocation)
        task = template_invocation.try(:run_host_job_task)
        parent_task = @job_invocation.task

        return(parent_task.result == 'cancelled' ? 'cancelled' : 'N/A') if task.nil?
        return task.state if task.state == 'running' || task.state == 'planned'
        return 'error' if task.result == 'warning'

        task.result
      end
    end
  end
end
