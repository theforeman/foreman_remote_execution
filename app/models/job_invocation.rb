class JobInvocation < ActiveRecord::Base
  include Authorizable

  belongs_to :targeting, :dependent => :destroy
  has_many :template_invocations, :inverse_of => :job_invocation, :dependent => :destroy

  validates :targeting, :presence => true
  validates :job_name, :presence => true

  delegate :bookmark, :to => :targeting, :allow_nil => true

  include ForemanTasks::Concerns::ActionSubject

  belongs_to :last_task, :class_name => 'ForemanTasks::Task'
  has_many :sub_tasks, :through => :last_task

  scoped_search :on => [:job_name], :complete_value => true

  attr_accessor :start_before
  attr_writer :start_at

  def self.allowed_trigger_modes
    %w(immediate future)
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
    if targeting.resolved_at.nil?
      _('N/A')
    else
      targeting.hosts.count
    end
  end

  def delay_options
    {
      :start_at => start_at_parsed,
      :start_before => start_before_parsed
    }
  end

  def trigger_mode
    @trigger_mode || :immediate
  end

  def trigger_mode=(value)
    return trigger_mode if @trigger_mode || value.nil?
    if JobInvocation.allowed_trigger_modes.include?(value)
      @trigger_mode = value.to_sym
    else
      raise ::Foreman::Exception, _("Job Invocation trigger mode must be one of [#{JobInvocation.allowed_trigger_modes.join(', ')}]")
    end
  end

  def start_at_parsed
    @start_at.present? && Time.strptime(@start_at, time_format)
  end

  def start_at
    @start_at ||= Time.now.strftime(time_format)
  end

  def start_before_parsed
    @start_before.present? && Time.strptime(@start_before, time_format) || nil
  end

  def time_format
    '%Y-%m-%d %H:%M'
  end
end
