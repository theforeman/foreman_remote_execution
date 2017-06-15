module ForemanRemoteExecution
  module ForemanTasksTaskExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_invocations, :dependent => :destroy, :foreign_key => 'task_id'
    end
  end
end
