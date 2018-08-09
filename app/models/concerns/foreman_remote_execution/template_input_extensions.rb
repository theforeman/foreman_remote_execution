module ForemanRemoteExecution
  module TemplateInputExtensions
    extend ActiveSupport::Concern

    included do
      has_many :template_invocation_input_values, :dependent => :destroy
    end
  end
end
