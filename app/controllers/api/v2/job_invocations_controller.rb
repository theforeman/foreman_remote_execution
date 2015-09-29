module Api
  module V2
    class JobInvocationsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Api::TaxonomyScope
      include ::Foreman::Renderer

      before_filter :find_optional_nested_object
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
          param :template_id, String, :required => false, :desc => N_("If using a specific template, the id of that template.")
          param :targeting_type, String, :required => true, :desc => N_("Invocation type, one of %s") % Targeting::TYPES
          param :inputs, Array, :required => false, :desc => N_("Inputs to use") do
            param :name, String, :required => true
            param :value, String, :required => true
          end
          param :bookmark_id, Integer, :required => false
          param :search_query, Integer, :required => false
        end
      end

      api :POST, "/job_invocations/", N_("Create a job template")
      param_group :job_invocation, :as => :create
      def create
        composer = JobInvocationApiComposer.new(JobInvocation.new, User.current, params[:job_invocation])
        composer.save!
        ForemanTasks.async_task(::Actions::RemoteExecution::RunHostsJob, composer.job_invocation)
        @job_invocation = composer.job_invocation
        process_response @job_invocation
      end

      private

      def validate_templates
        templates = []
        if params[:job_invocation][:template_id]
          templates << JobTemplate.find(params[:job_invocation][:template_id])
        else
          templates = JobTemplate.where(:job_name => params[:job_invocation][:job_name])
          if templates.pluck(:provider_type).uniq.length != templates.length
            raise Foreman::Exception, _("Duplicate remote execution providers found for specified Job, please specify a single template_id.")
          end
        end

        raise Foreman::Exception, _("No templates associated with specified Job Name") if templates.empty?
      end
    end
  end
end
