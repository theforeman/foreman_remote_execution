module ForemanRemoteExecution
  module TemplateRelations
    extend ActiveSupport::Concern

    included do
      has_many :template_inputs, :dependent => :destroy, :foreign_key => 'template_id'
    end
  end
end
