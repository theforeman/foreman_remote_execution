module Api
  module V2
    class JobTemplatesController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Api::TaxonomyScope
      include ::Foreman::Renderer
      include ::Foreman::Controller::ProvisioningTemplates

      before_filter :find_optional_nested_object
      before_filter :find_resource, :only => %w{show update destroy clone}

      before_filter :handle_template_upload, :only => [:create, :update]

      wrap_parameters JobTemplate, :include => (JobTemplate.attribute_names + [:ssh])

      api :GET, "/job_templates/", N_("List job templates")
      api :GET, "/locations/:location_id/job_templates/", N_("List job templates per location")
      api :GET, "/organizations/:organization_id/job_templates/", N_("List job templates per organization")
      param_group :taxonomy_scope, ::Api::V2::BaseController
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @job_templates = resource_scope_for_index
      end

      api :GET, "/job_templates/:id", N_("Show job template details")
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :job_template do
        param :job_template, Hash, :required => true, :action_aware => true do
          param :name, String, :required => true, :desc => N_("Template name")
          param :job_name, String, :required => true, :desc => N_("Job name")
          param :description_format, String, :required => false, :desc => N_('This template is used to generate the description. Input values ' +
                                                                             'can be used using the syntax %{fqdn}. You may also include the ' +
                                                                             'job name using %{job_name}.')
          param :template, String, :required => true
          param :provider_type, RemoteExecutionProvider.provider_names, :required => true, :desc => N_("Provider type")
          param :snippet, :bool, :allow_nil => true
          param :audit_comment, String, :allow_nil => true
          param :locked, :bool, :desc => N_("Whether or not the template is locked for editing")
          param :ssh, Hash, :desc => N_("Ssh provider specific options") do
            param :effective_user, Hash, :desc => N_("Effective user options") do
              param :value, String, :desc => N_("What user should be used to run the script (using sudo-like mechanisms)"), :allowed_nil => true
              param :overridable, :bool, :desc => N_("Whether it should be allowed to override the effective user from the invocation form.")
              param :current_user, :bool, :desc => N_("Whether the current user login should be used as the effective user")
            end
          end
          param_group :taxonomies, ::Api::V2::BaseController
        end
      end

      api :POST, "/job_templates/", N_("Create a job template")
      param_group :job_template, :as => :create
      def create
        @job_template = JobTemplate.new(job_template_params)
        process_response @job_template.save
      end

      api :PUT, "/job_templates/:id", N_("Update a job template")
      param :id, :identifier, :required => true
      param_group :job_template
      def update
        process_response @job_template.update_attributes(job_template_params)
      end

      api :GET, "/job_templates/revision"
      param :version, String, :desc => N_("Template version")
      def revision
        audit = Audit.authorized(:view_audit_logs).find(params[:version])
        render :json => audit.revision.template
      end

      api :DELETE, "/job_templates/:id", N_("Delete a job template")
      param :id, :identifier, :required => true
      def destroy
        process_response @job_template.destroy
      end

      def_param_group :job_template_clone do
        param :job_template, Hash, :required => true, :action_aware => true do
          param :name, String, :required => true, :desc => N_("Template name")
        end
      end

      api :POST, "/job_templates/:id/clone", N_("Clone a provision template")
      param :id, :identifier, :required => true
      param_group :job_template_clone, :as => :create
      def clone
        @job_template = @job_template.clone
        load_vars_from_template
        @job_template.name = job_template_params[:name]
        process_response @job_template.save
      end

      def resource_name
        'job_template'
      end

      private

      def job_template_params
        job_template_params = params[:job_template].dup
        effective_user_attributes = (job_template_params.delete(:ssh) || {}).fetch(:effective_user, {})
        job_template_params.merge(:effective_user_attributes => effective_user_attributes)
      end

      def action_permission
        case params[:action]
        when 'clone'
          :create
        else
          super
        end
      end

      def resource_class
        JobTemplate
      end

      def allowed_nested_id
        %w(location_id organization_id)
      end
    end
  end
end
