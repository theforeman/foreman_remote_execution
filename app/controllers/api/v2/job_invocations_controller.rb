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

      api :GET, "/job_invocations/", N_("List job invocations")
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @job_invocations = resource_scope_for_index
      end

      api :GET, "/job_invocations/:id", N_("Show job invocation")
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :job_invocation do
        param :job_invocation, Hash, :required => true, :action_aware => true do
          param :job_name, String, :required => true, :desc => N_("Job name")
          param :job_template_id, String, :required => false, :desc => N_("If using a specific template, the id of that template.")
          param :targeting_type, String, :required => true, :desc => N_("Invocation type, one of %s") % Targeting::TYPES
          param :inputs, Hash, :required => false, :desc => N_("Inputs to use")
          param :bookmark_id, Integer, :required => false
          param :search_query, Integer, :required => false
        end
      end

      api :POST, "/job_invocations/", N_("Create a job invocation")
      param_group :job_invocation, :as => :create
      def create
        composer = JobInvocationApiComposer.new(JobInvocation.new, User.current, params[:job_invocation])
        composer.save!
        ForemanTasks.async_task(::Actions::RemoteExecution::RunHostsJob, composer.job_invocation)
        @job_invocation = composer.job_invocation
        process_response @job_invocation
      end

      api :GET, "/job_invocations/:id/hosts/:host_id", N_("Get output for a host")
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
        if params[:job_invocation][:job_template_id]
          templates << JobTemplate.find(params[:job_invocation][:job_template_id])
        else
          templates = JobTemplate.where(:job_name => params[:job_invocation][:job_name])
          if templates.pluck(:provider_type).uniq.length != templates.length
            raise Foreman::Exception, _("Duplicate remote execution providers found for specified Job, please specify a single job_template_id.")
          end
        end

        raise Foreman::Exception, _("No templates associated with specified Job Name") if templates.empty?
      end
    end
  end
end
