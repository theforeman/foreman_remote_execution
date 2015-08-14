module ForemanRemoteExecution
  module ForemanTasksTaskExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_invocations, :dependent => :nullify, :foreign_key => 'last_task_id'
    end
  end
end
