module Api
  module V2
    class JobInvocationsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Renderer
      include RemoteExecutionHelper

      before_action :find_optional_nested_object, :only => %w{output raw_output}
      before_action :find_host, :only => %w{output raw_output}
      before_action :find_resource, :only => %w{show update destroy clone cancel rerun outputs hosts}

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
        set_hosts_and_template_invocations
        @job_organization = Taxonomy.find_by(id: @job_invocation.task.input[:current_organization_id])
        @job_location = Taxonomy.find_by(id: @job_invocation.task.input[:current_location_id])
        if params[:host_status] == 'true'
          set_statuses_and_smart_proxies
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
            param :effective_user_password, String,
              :required => false,
              :desc => N_('Set password for effective user (using sudo-like mechanisms)')
          end
          param :ssh_user, String, :required => false, :desc => N_('Set SSH user')
          param :password, String, :required => false, :desc => N_('Set SSH password')
          param :key_passphrase, String, :required => false, :desc => N_('Set SSH key passphrase')

          param :recurrence, Hash, :desc => N_('Create a recurring job') do
            param :cron_line, String, :required => false, :desc => N_('How often the job should occur, in the cron format')
            param :max_iteration, :number, :required => false, :desc => N_('Repeat a maximum of N times')
            param :end_time, DateTime, :required => false, :desc => N_('Perform no more executions after this time')
            param :purpose, String, :required => false, :desc => N_('Designation of a special purpose')
          end

          param :scheduling, Hash, :desc => N_('Schedule the job to start at a later time') do
            param :start_at, DateTime, :required => false, :desc => N_('Schedule the job for a future time')
            param :start_before, DateTime, :required => false, :desc => N_('Indicates that the action should be cancelled if it cannot be started before this time.')
          end

          param :concurrency_control, Hash, :desc => N_('Control concurrency level and distribution over time') do
            param :concurrency_level, Integer, :desc => N_('Run at most N tasks at a time')
          end

          param :bookmark_id, Integer, :required => false
          param :search_query, String, :required => false
          param :description_format, String, :required => false, :desc => N_('Override the description format from the template for this invocation only')
          param :execution_timeout_interval, Integer, :required => false, :desc => N_('Override the timeout interval from the template for this invocation only')
          param :feature, String, :required => false, :desc => N_('Remote execution feature label that should be triggered, job template assigned to this feature will be used')
          param :time_to_pickup, Integer, :required => false, :desc => N_('Override the global time to pickup interval for this invocation only')

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

      api :GET, '/job_invocations/:id/hosts', N_('List hosts belonging to job invocation')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(JobInvocation)
      param :id, :identifier, :required => true
      def hosts
        set_hosts_and_template_invocations
        set_statuses_and_smart_proxies
        @total = @job_invocation.targeting.hosts.size
        @hosts = @hosts.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page], :per_page => params[:per_page])
        if params[:awaiting]
          @hosts = @hosts.select { |host| @host_statuses[host.id] == 'N/A' }
          @subtotal = @hosts.size
        else
          @subtotal = @hosts.respond_to?(:total_entries) ? @hosts.total_entries : @hosts.sizes
        end
        render :hosts, :layout => 'api/v2/layouts/index_layout'
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

      api :POST, '/job_invocations/:id/cancel', N_('Cancel job invocation or matching tasks only')
      param :id, :identifier, :required => true
      param :force, :bool
      param :search, String, :desc => N_('Search query to cancel tasks only on matching hosts. If not provided, the whole job invocation will be cancelled.')
      def cancel
        force = params.fetch('force', false)
        search = params[:search]

        if search.present?
          begin
            hosts_scope = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)
            matching_hosts = hosts_scope.search_for(search)
            tasks_to_process = @job_invocation.template_invocations
                                              .where(host_id: matching_hosts.select(:id))
                                              .includes(:run_host_job_task)

            cancelled, skipped = tasks_to_process.partition { |ti| ti.run_host_job_task&.cancellable? }
            cancelled.each do |ti|
              if force
                ti.run_host_job_task.abort
              else
                ti.run_host_job_task.cancel
              end
            end
            render json: {
              total: tasks_to_process.size,
              cancelled: cancelled.map(&:run_host_job_task_id),
              skipped: skipped.map(&:run_host_job_task_id),
            }
          rescue StandardError => e
            render json: { error: { message: "Failed to cancel tasks on hosts: #{e.message}" } }, status: :unprocessable_entity
          end
        elsif @job_invocation.task.cancellable?
          result = @job_invocation.cancel(force)
          render json: { cancelled: result, id: @job_invocation.id }
        else
          render json: { message: _('The job could not be cancelled.') }, status: :unprocessable_entity
        end
      end

      api :POST, '/job_invocations/:id/rerun', N_('Rerun job on failed hosts')
      param :id, :identifier, :required => true
      param :failed_only, :bool
      param :succeeded_only, :bool
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

      def resource_name(resource = controller_name)
        case resource
        when 'organization', 'location'
          nil
        else
          'job_invocation'
        end
      end

      private

      def allowed_nested_id
        %w(job_invocation_id)
      end

      def action_permission
        case params[:action]
        when 'output', 'raw_output', 'outputs', 'hosts'
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
          job_invocation_params.merge!(job_invocation_params.delete(:ssh).permit(:effective_user, :effective_user_password))
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

      def set_hosts_and_template_invocations
        @pattern_template_invocations = @job_invocation.pattern_template_invocations.includes(:input_values)
        @hosts = @job_invocation.targeting.hosts.authorized(:view_hosts, Host)

        unless params[:search].nil?
          @hosts = @hosts.joins(:template_invocations)
                         .where(:template_invocations => { :job_invocation_id => @job_invocation.id})
        end
        @template_invocations = @job_invocation.template_invocations
                                               .where(host: @hosts)
                                               .includes(:input_values)
      end

      def set_statuses_and_smart_proxies
        template_invocations = @template_invocations.includes(:run_host_job_task).to_a
        hosts = @hosts.to_a
        @host_statuses = Hash[hosts.map do |host|
          template_invocation = template_invocations.find { |ti| ti.host_id == host.id }
          task = template_invocation.try(:run_host_job_task)
          [host.id, template_invocation_status(task, @job_invocation.task)]
        end]
        @smart_proxy_id = Hash[template_invocations.map { |ti| [ti.host_id, ti.smart_proxy_id] }]
        @smart_proxy_name = Hash[template_invocations.map { |ti| [ti.host_id, ti.smart_proxy_name] }]
      end
    end
  end
end
