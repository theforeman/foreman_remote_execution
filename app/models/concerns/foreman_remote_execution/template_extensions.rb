module ForemanRemoteExecution
  module TemplateExtensions
    extend ActiveSupport::Concern

    included do
      # autosave => true is required so the changes of inputs are saved even if template was not changed
      has_many :template_inputs, :dependent => :destroy, :foreign_key => 'template_id', :autosave => true
      has_many :foreign_input_sets, :dependent => :destroy, :foreign_key => 'template_id', :autosave => true

      def template_inputs_with_foreign(templates_stack = [])
        self.template_inputs.to_a + foreign_input_sets.map { |set| set.inputs(templates_stack) }.flatten
      end
      accepts_nested_attributes_for :template_inputs, :allow_destroy => true
      accepts_nested_attributes_for :foreign_input_sets, :allow_destroy => true
      attr_accessible :template_inputs_attributes, :foreign_input_sets_attributes
    end

    # create or overwrite instance methods...
    # def instance_method_name
    # end

    # module ClassMethods
    #   # create or overwrite class methods...
    #   def class_method_name
    #   end
    # end
  end
end
