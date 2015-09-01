class JobInvocation < ActiveRecord::Base
  include Authorizable

  belongs_to :targeting, :dependent => :destroy
  has_many :template_invocations, :inverse_of => :job_invocation, :dependent => :destroy

  validates :targeting, :presence => true
  validates :job_name, :presence => true

  delegate :bookmark, :to => :targeting, :allow_nil => true

  include ForemanTasks::Concerns::ActionSubject

  belongs_to :last_task, :class_name => 'ForemanTasks::Task'

  scoped_search :on => [:job_name], :complete_value => true

  def to_action_input
    { :id => id, :name => job_name }
  end

  def template_invocations_tasks
    if last_task.present?
      last_task.sub_tasks.for_action_types('Actions::RemoteExecution::RunHostJob')
    else
      ForemanTasks::Task.for_action_types('Actions::RemoteExecution::RunHostJob').where('1=0')
    end
  end

  def failed_template_invocation_tasks
    template_invocations_tasks.where(:result => 'warning')
  end

  def failed_host_ids
    locks_for_resource(failed_template_invocation_tasks, 'Host::Managed').map(&:resource_id)
  end

  def failed_hosts
    locks_for_resource(failed_template_invocation_tasks, 'Host::Managed').map(&:resource)
  end

  def locks_for_resource(tasks, resource_type)
    tasks.map { |task| task.locks.where(:resource_type => resource_type).first }.compact
  end
end
