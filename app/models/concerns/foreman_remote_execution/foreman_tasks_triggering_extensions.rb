module ForemanRemoteExecution
  module ForemanTasksTriggeringExtensions
    extend ActiveSupport::Concern

    included do
      has_one :job_invocation, :dependent => :nullify, :foreign_key => 'triggering_id'
    end
  end
end
