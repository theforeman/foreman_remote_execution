module ForemanRemoteExecution
  module TemplateRelations
    extend ActiveSupport::Concern

    included do
      # autosave => true is required so the changes of inputs are saved even if template was not changed
      has_many :template_inputs, :dependent => :destroy, :foreign_key => 'template_id', :autosave => true
    end
  end
end
