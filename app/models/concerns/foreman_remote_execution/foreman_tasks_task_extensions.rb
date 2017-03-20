module ForemanRemoteExecution
  module ForemanTasksTaskExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_invocations, :dependent => :nullify, :foreign_key => 'task_id'
      has_one :template_invocation, :foreign_key => 'run_host_job_task_id', :class_name => 'TemplateInvocation'
    end
  end
end
