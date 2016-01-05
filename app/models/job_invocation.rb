class JobInvocation < ActiveRecord::Base
  include Authorizable

  include ForemanRemoteExecution::ErrorsFlattener
  FLATTENED_ERRORS_MAPPING = { :template_invocations => lambda do |template_invocation|
                                                          _("template") + " #{template_invocation.template.name}"
                                                        end }

  belongs_to :targeting, :dependent => :destroy
  has_many :template_invocations, :inverse_of => :job_invocation, :dependent => :destroy

  validates :targeting, :presence => true
  validates :job_name, :presence => true
  validates_associated :targeting, :template_invocations

  scoped_search :on => :job_name

  scoped_search :in => :recurring_logic, :on => 'id', :rename => 'recurring_logic.id', :auto_complete => true

  delegate :bookmark, :resolved?, :to => :targeting, :allow_nil => true

  include ForemanTasks::Concerns::ActionSubject

  belongs_to :task, :class_name => 'ForemanTasks::Task'
  has_many :sub_tasks, :through => :task

  belongs_to :task_group, :class_name => 'JobInvocationTaskGroup'

  has_many :tasks, :through => :task_group, :class_name => 'ForemanTasks::Task'

  scoped_search :on => [:job_name], :complete_value => true

  scoped_search :in => :task, :on => :started_at, :rename => 'started_at', :complete_value => true
  scoped_search :in => :task, :on => :start_at, :rename => 'start_at', :complete_value => true
  scoped_search :in => :task, :on => :ended_at, :rename => 'ended_at', :complete_value => true

  belongs_to :triggering, :class_name => 'ForemanTasks::Triggering'
  has_one :recurring_logic, :through => :triggering, :class_name => 'ForemanTasks::RecurringLogic'

  scope :with_task, -> { joins('LEFT JOIN foreman_tasks_tasks ON foreman_tasks_tasks.id = job_invocations.task_id') }

  default_scope -> { order('job_invocations.id DESC') }

  attr_accessor :start_before, :description_format
  attr_writer :start_at

  delegate :start_at, :to => :task, :allow_nil => true

  def deep_clone
    JobInvocationComposer.from_job_invocation(self).job_invocation.tap do |invocation|
      invocation.task_group = JobInvocationTaskGroup.new.tap(&:save!)
      invocation.triggering = self.triggering
      invocation.description_format = self.description_format
      invocation.description = self.description
      invocation.template_invocations = self.template_invocations.map(&:deep_clone)
      invocation.save!
    end
  end

  def to_action_input
    { :id => id, :name => job_name }
  end

  def template_invocation_tasks
    sub_tasks.for_action_types('Actions::RemoteExecution::RunHostJob')
  end

  def failed_template_invocation_tasks
    template_invocation_tasks.where(:result => 'warning')
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

  def total_hosts_count
    if targeting.resolved?
      targeting.hosts.count
    else
      _('N/A')
    end
  end

  def template_invocation_for_host(host)
    providers = available_providers(host)
    providers.each do |provider|
      template_invocations.each do |template_invocation|
        if template_invocation.template.provider_type == provider
          return template_invocation
        end
      end
    end
  end

  # TODO: determine from the host and job_invocation details
  def available_providers(host)
    return RemoteExecutionProvider.provider_names
  end

  def sub_task_for_host(host)
    sub_tasks.joins(:locks).where("#{ForemanTasks::Lock.table_name}.resource_type" => 'Host::Managed', "#{ForemanTasks::Lock.table_name}.resource_id" => host.id).first
  end

  def output(host)
    return unless (task = sub_task_for_host(host)) && task.main_action && task.main_action.live_output.any?
    task.main_action.live_output.first['output']
  end

  def generate_description!
    key_re = /%\{([^\}]+)\}/
    template_invocation = template_invocations.first
    input_names = template_invocation.template.template_input_names
    hash_base = Hash.new { |hash, key| hash[key] = "%{#{key}}" }
    input_hash = hash_base.merge Hash[input_names.zip(template_invocation.input_values.pluck(:value))]
    input_hash.update(:job_name => job_name)
    description_format.scan(key_re) { |key| input_hash[key.first] }
    self.description = description_format
    input_hash.each do |k, v|
      self.description.gsub!(Regexp.new("%\{#{k}\}"), v)
    end
    save!
  end
end
