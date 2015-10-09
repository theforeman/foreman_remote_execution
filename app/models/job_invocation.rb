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

  delegate :bookmark, :resolved?, :to => :targeting, :allow_nil => true

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
    if targeting.resolved?
      targeting.hosts.count
    else
      _('N/A')
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
end
