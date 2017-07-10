module ForemanRemoteExecution
  module ForemanTasksCleanerExtensions
    extend ActiveSupport::Concern

    included do
      prepend ForemanRemoteExecution::JobInvocationCleaner
    end
  end

  module JobInvocationCleaner
    def delete
      super
      if noop
        say '[noop] deleting orphaned job invocations'
        say "[noop] #{orphaned_job_invocations.count} job invocations would be deleted"
      else
        count = orphaned_job_invocations.count
        orphaned_job_invocations.find_each(&:destroy)
        say "deleted #{count} orphaned job_invocations", false if verbose
      end
    end

    def delete_tasks(chunk)
      super(chunk)
      delete_job_invocations(chunk)
    end

    def delete_job_invocations(chunk)
      JobInvocation.where(:task_id => chunk.map(&:id)).find_each(&:destroy)
    end

    def orphaned_job_invocations
      JobInvocation.joins('LEFT JOIN foreman_tasks_tasks ON task_id = foreman_tasks_tasks.id')
                   .where('task_id IS NOT NULL and foreman_tasks_tasks.id IS NULL')
    end
  end
end
