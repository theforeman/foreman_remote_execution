module Api
  module V2
    class TemplateInputsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Renderer

      before_filter :find_required_nested_object
      before_filter :find_resource, :only => %w{show update destroy clone}
      before_filter :normalize_options, :only => %w{create update}

      api :GET, '/templates/:template_id/template_inputs', N_('List template inputs')
      param :template_id, :identifier, :required => true
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @template_inputs = nested_obj.template_inputs.search_for(*search_options).paginate(paginate_options)
      end

      api :GET, '/templates/:template_id/template_inputs/:id', N_('Show template input details')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :template_input do
        param :template_input, Hash, :required => true, :action_aware => true do
          param :name, String, :required => true, :desc => N_('Input name')
          param :description, String, :required => false, :desc => N_('Input description')
          param :required, :bool, :allow_nil => true, :desc => N_('Input is required')
          param :input_type, TemplateInput::TYPES.keys.map(&:to_s), :required => true, :desc => N_('Input type')
          param :fact_name, String, :required => false, :desc => N_('Fact name, used when input type is fact')
          param :variable_name, String, :required => false, :desc => N_('Variable name, used when input type is variable')
          param :puppet_parameter_class, String, :required => false, :desc => N_('Puppet class name, used when input type is puppet_parameter')
          param :puppet_parameter_name, String, :required => false, :desc => N_('Puppet parameter name, used when input type is puppet_parameter')
          param :options, Array, :required => false, :desc => N_('Selectable values for user inputs')
        end
      end

      api :POST, '/templates/:template_id/template_inputs/', N_('Create a template input')
      param :template_id, :identifier, :required => true
      param_group :template_input, :as => :create
      def create
        @template_input = TemplateInput.new(params[:template_input].merge(:template_id => @nested_obj.id))
        process_response @template_input.save
      end

      api :DELETE, '/templates/:template_id/template_inputs/:id', N_('Delete a template input')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      def destroy
        process_response @template_input.destroy
      end

      api :PUT, '/templates/:template_id/template_inputs/:id', N_('Update a template input')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      param_group :template_input
      def update
        process_response @template_input.update_attributes(params[:template_input])
      end

      def resource_name(nested_resource = nil)
        nested_resource || 'template_input'
      end

      def controller_permission
        'templates'
      end

      def action_permission
        case params[:action]
        when :create, :edit, :destroy
          'edit'
        else
          super
        end
      end

      private

      def normalize_options
        if params[:template_input][:options].is_a?(Array)
          params[:template_input][:options] = params[:template_input][:options].join("\n")
        end
      end

      def resource_class
        TemplateInput
      end
    end
  end
end
