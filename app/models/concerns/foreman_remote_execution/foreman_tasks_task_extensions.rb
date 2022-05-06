module ForemanRemoteExecution
  module ForemanTasksTaskExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_invocations, :dependent => :destroy, :foreign_key => 'task_id'
      has_one :template_invocation, :inverse_of => :run_host_job_task, :foreign_key => 'run_host_job_task_id', :dependent => :nullify
      has_one :template, :through => :template_invocation
      has_many :remote_execution_features, :through => :template

      scoped_search :relation => :remote_execution_features, :on => :name, :rename => 'remote_execution_feature.name'
      scoped_search :relation => :remote_execution_features, :on => :label, :rename => 'remote_execution_feature.label'
    end
  end
end
