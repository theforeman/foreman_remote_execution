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
          param :template, String, :required => true
          param :provider_type, RemoteExecutionProvider.provider_names, :required => true, :desc => N_("Provider type")
          param :snippet, :bool, :allow_nil => true
          param :audit_comment, String, :allow_nil => true
          param :locked, :bool, :desc => N_("Whether or not the template is locked for editing")
          param_group :taxonomies, ::Api::V2::BaseController
        end
      end

      api :POST, "/job_templates/", N_("Create a job template")
      param_group :job_template, :as => :create
      def create
        @job_template = JobTemplate.new(params[:job_template])
        process_response @job_template.save
      end

      api :PUT, "/job_templates/:id", N_("Update a job template")
      param :id, :identifier, :required => true
      param_group :job_template
      def update
        process_response @job_template.update_attributes(params[:job_template])
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
        @job_template.name = params[:job_template][:name]
        process_response @job_template.save
      end

      def resource_name
        'job_template'
      end

      private

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
