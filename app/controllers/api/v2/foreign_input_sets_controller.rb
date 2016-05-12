module Api
  module V2
    class ForeignInputSetsController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Renderer

      before_filter :find_required_nested_object
      before_filter :find_resource, :only => %w{show update destroy}

      api :GET, '/templates/:template_id/foreign_input_sets', N_('List foreign input sets')
      param :template_id, :identifier, :required => true
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @foreign_input_sets = nested_obj.foreign_input_sets.search_for(*search_options).paginate(paginate_options)
      end

      api :GET, '/templates/:template_id/foreign_input_sets/:id', N_('Show foreign input set details')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      def show
      end

      def_param_group :foreign_input_set do
        param :foreign_input_set, Hash, :required => true, :action_aware => true do
          param :target_template_id, :identifier, :required => true, :desc => N_('Target template ID')
          param :include_all, :bool, :desc => N_('Include all inputs from the foreign template')
          param :include, String, :desc => N_('A comma separated list of input names to be included from the foreign template.')
          param :exclude, String, :desc => N_('A comma separated list of input names to be included from the foreign template.')
          param :description, String, :required => false, :desc => N_('Input set description')
        end
      end

      api :POST, '/templates/:template_id/foreign_input_sets/', N_('Create a foreign input set')
      param :template_id, :identifier, :required => true
      param_group :foreign_input_set, :as => :create
      def create
        @foreign_input_set = resource_class.new(params[:foreign_input_set].merge(:template_id => @nested_obj.id))
        process_response @foreign_input_set.save
      end

      api :DELETE, '/templates/:template_id/foreign_input_sets/:id', N_('Delete a foreign input set')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      def destroy
        process_response @foreign_input_set.destroy
      end

      api :PUT, '/templates/:template_id/foreign_input_sets/:id', N_('Update a foreign input set')
      param :template_id, :identifier, :required => true
      param :id, :identifier, :required => true
      param_group :foreign_input_set
      def update
        process_response @foreign_input_set.update_attributes(params[:foreign_input_set])
      end

      def resource_name(nested_resource = nil)
        nested_resource || 'foreign_input_set'
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

      def resource_class
        ForeignInputSet
      end
    end
  end
end
