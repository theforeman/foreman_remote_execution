module ForemanRemoteExecution
  module TemplateExtensions
    extend ActiveSupport::Concern

    included do
      accepts_nested_attributes_for :template_inputs, :allow_destroy => true
      attr_accessible :template_inputs_attributes
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
