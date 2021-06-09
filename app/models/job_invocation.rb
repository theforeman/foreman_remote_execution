class JobInvocation < ApplicationRecord
  CACHE_PREFIX = "job_invocation".freeze

  audited :except => [:task_id, :targeting_id, :task_group_id, :triggering_id]

  include Authorizable
  include Encryptable

  include ForemanRemoteExecution::ErrorsFlattener
  FLATTENED_ERRORS_MAPPING = {
    :pattern_template_invocations => lambda do |template_invocation|
      _('template') + " #{template_invocation.template.name}"
    end,
  }.freeze

  belongs_to :targeting, :dependent => :destroy
  has_many :all_template_invocations, :inverse_of => :job_invocation, :dependent => :destroy, :class_name => 'TemplateInvocation'
  has_many :template_invocations, -> { where('template_invocations.host_id IS NOT NULL') }, :inverse_of => :job_invocation
  has_many :pattern_template_invocations, -> { where('template_invocations.host_id IS NULL') }, :inverse_of => :job_invocation, :class_name => 'TemplateInvocation'
  has_many :pattern_templates, :through => :pattern_template_invocations, :source => :template

  validates :targeting, :presence => true
  validates :job_category, :presence => true
  validates_associated :targeting, :all_template_invocations

  scoped_search :on => :id, :complete_value => true
  scoped_search :on => :job_category, :complete_value => true
  scoped_search :on => :description, :complete_value => true

  has_many :template_invocations_hosts, :through => :template_invocations, :source => :host
  scoped_search :relation => :template_invocations_hosts, :on => :name, :rename => 'host', :complete_value => true

  delegate :bookmark, :resolved?, :to => :targeting, :allow_nil => true

  include ForemanTasks::Concerns::ActionSubject

  belongs_to :task, :class_name => 'ForemanTasks::Task'
  has_many :sub_tasks, :through => :task

  belongs_to :task_group, :class_name => 'JobInvocationTaskGroup'

  has_many :tasks, :through => :task_group, :class_name => 'ForemanTasks::Task'
  has_many :template_invocation_tasks, :through => :template_invocations,
                                       :class_name => 'ForemanTasks::Task',
                                       :source => 'run_host_job_task'
  has_one :user, through: :task
  scoped_search relation: :user, on: :login, rename: 'user', complete_value: true,
    value_translation: ->(value) { value == 'current_user' ? User.current.login : value },
    special_values: [:current_user], aliases: ['owner'], :only_explicit => true
  scoped_search :relation => :task, :on => :started_at, :rename => 'started_at', :complete_value => true
  scoped_search :relation => :task, :on => :start_at, :rename => 'start_at', :complete_value => true
  scoped_search :relation => :task, :on => :ended_at, :rename => 'ended_at', :complete_value => true
  scoped_search :relation => :task, :on => :state, :rename => 'status', :ext_method => :search_by_status,
    :only_explicit => true, :complete_value => Hash[HostStatus::ExecutionStatus::STATUS_NAMES.values.map { |v| [v, v] }]

  belongs_to :triggering, :class_name => 'ForemanTasks::Triggering'
  has_one :recurring_logic, :through => :triggering, :class_name => 'ForemanTasks::RecurringLogic'

  belongs_to :remote_execution_feature

  has_many :targeted_hosts, :through => :targeting, :source => :hosts
  scoped_search :on => 'targeted_host_id', :rename => 'targeted_host_id', :operators => ['= '],
    :complete_value => false, :only_explicit => true, :ext_method => :search_by_targeted_host

  scoped_search :on => 'pattern_template_name', :rename => 'pattern_template_name', :operators => ['= '],
    :complete_value => false, :only_explicit => true, :ext_method => :search_by_pattern_template

  scope :with_task, -> { references(:task) }

  scoped_search :relation => :recurring_logic, :on => 'id', :rename => 'recurring_logic.id'

  scoped_search :relation => :recurring_logic, :on => 'id', :rename => 'recurring',
    :ext_method => :search_by_recurring_logic, :only_explicit => true,
    :complete_value => { :true => true, :false => false }

  default_scope -> { order('job_invocations.id DESC') }

  validates_lengths_from_database :only => [:description]

  attr_accessor :start_before, :description_format
  attr_writer :start_at

  delegate :start_at, :to => :task, :allow_nil => true

  encrypts :password, :key_passphrase, :effective_user_password

  class Jail < Safemode::Jail
    allow :sub_task_for_host, :template_invocations_hosts
  end

  def self.search_by_targeted_host(key, operator, value)
    { :conditions => sanitize_sql_for_conditions(["hosts.id = ?", value]), :joins => :targeted_hosts }
  end

  def self.search_by_pattern_template(key, operator, value)
    { :conditions => sanitize_sql_for_conditions(["templates.name = ?", value]), :joins => :pattern_templates }
  end

  def self.search_by_status(key, operator, value)
    conditions = HostStatus::ExecutionStatus::ExecutionTaskStatusMapper.sql_conditions_for(value)
    conditions[0] = "NOT (#{conditions[0]})" if operator == '<>'
    { :conditions => sanitize_sql_for_conditions(conditions), :include => :task }
  end

  def self.search_by_recurring_logic(key, operator, value)
    reucurring = value == 'true'
    reucurring = !reucurring if operator == '<>'
    not_operator = reucurring ? 'NOT' : ''

    { :conditions => sanitize_sql_for_conditions(["foreman_tasks_recurring_logics.id IS #{not_operator} NULL"]), :joins => :recurring_logic }
  end

  def notification_recipients_ids
    [ self.targeting.user_id ]
  end

  def build_notification
    klass = nil
    if self.remote_execution_feature && self.remote_execution_feature.notification_builder.present?
      begin
        klass = remote_execution_feature.notification_builder.constantize
      rescue NameError => e
        logger.exception "REX feature defines unknown notification builder class", e
      end
    end
    klass ||= UINotifications::RemoteExecutionJobs::BaseJobFinish
    klass.new(self)
  end

  def status
    HostStatus::ExecutionStatus::ExecutionTaskStatusMapper.new(task).status
  end

  def status_label
    HostStatus::ExecutionStatus::ExecutionTaskStatusMapper.new(task).status_label
  end

  def to_label
    description
  end

  # returns progress in percents
  def progress(total = nil, done = nil)
    if queued? || !targeting.resolved? || done == 0
      0
    else
      total ||= targeting.hosts.count
      done  ||= sub_tasks.where(:result => %w(success warning error)).count
      ((done.to_f / total) * 100).round
    end
  end

  def queued?
    status == HostStatus::ExecutionStatus::QUEUED
  end

  def deep_clone
    JobInvocationComposer.from_job_invocation(self).job_invocation.tap do |invocation|
      invocation.task_group = JobInvocationTaskGroup.new
      invocation.triggering = self.triggering
      invocation.description_format = self.description_format
      invocation.description = self.description
      invocation.pattern_template_invocations = self.pattern_template_invocations.map(&:deep_clone)
      invocation.password = self.password
      invocation.key_passphrase = self.key_passphrase
      invocation.effective_user_password = self.effective_user_password
    end
  end

  def deep_clone!
    deep_clone.tap(&:save!)
  end

  def to_action_input
    { :id => id, :name => job_category, :description => description }
  end

  def failed_template_invocation_tasks
    template_invocation_tasks.where(:result => TemplateInvocation::TaskResultMap.status_to_task_result(:failed))
  end

  def failed_host_ids
    failed_hosts.pluck(:id)
  end

  def failed_hosts
    base = targeting.hosts
    if finished?
      base.where.not(:id => not_failed_template_invocations.select(:host_id))
    else
      base.where(:id => failed_template_invocations.select(:host_id))
    end
  end

  def total_hosts_count
    count = _('N/A')

    if targeting.resolved?
      count = if task&.main_action.respond_to?(:total_count)
                task.main_action.total_count
              else
                targeting.hosts.count
              end
    end
    count
  end

  def pattern_template_invocation_for_host(host)
    providers = available_providers(host)
    providers.each do |provider|
      pattern_template_invocations.each do |template_invocation|
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
    template_invocations.find_by(:host => host.id).try(:run_host_job_task)
  end

  def output(host)
    return unless (task = sub_task_for_host(host)) && task.main_action && task.main_action.live_output.any?

    task.main_action.live_output.first['output']
  end

  def generate_description
    template_invocation = pattern_template_invocations.first
    input_hash = template_invocation.input_values.reduce({}) do |h, v|
      value = v.value
      value = '*' * 3 if v.template_input.respond_to?(:hidden_value) && v.template_input.hidden_value?
      h.update("%{#{v.template_input.name}}" => value)
    end
    input_hash.update("%{job_category}" => job_category)
    input_hash.update("%{template_name}" => template_invocation.template.name)
    input_hash.default = "''"
    self.description = description_format.gsub(/%{[^}]+}/) { |key| input_hash[key] }
    self.description = self.description[0..(JobInvocation.columns_hash['description'].limit - 1)]
  end

  def progress_report
    map = TemplateInvocation::TaskResultMap
    all_keys = (map.results | map.statuses | [:progress, :total])
    if queued? || (task && task.started_at.nil?) || !targeting.resolved?
      all_keys.reduce({}) do |acc, key|
        acc.merge(key => 0)
      end
    else
      counts  = task.sub_tasks_counts
      done    = counts.values_at(*map.results).reduce(:+)
      percent = progress(counts[:total], done)
      counts.merge(:progress => percent, :failed => counts.values_at(*map.status_to_task_result(:failed)).reduce(:+))
    end
  end

  def cancel(force = false)
    method = force ? :abort : :cancel
    task.send(method)
  end

  def finished?
    !(task.nil? || task.pending?)
  end

  def missing_hosts_count
    targeting.resolved? ? total_hosts_count - targeting.hosts.count : 0
  end

  private

  def failed_template_invocations
    results = [:cancelled, :failed].map { |state| TemplateInvocation::TaskResultMap.status_to_task_result(state) }.flatten
    template_invocations.joins(:run_host_job_task).where(ForemanTasks::Task.table_name => { :result => results })
  end

  def not_failed_template_invocations
    results = [:cancelled, :failed].map { |state| TemplateInvocation::TaskResultMap.status_to_task_result(state) }.flatten
    template_invocations.joins(:run_host_job_task).where.not(ForemanTasks::Task.table_name => { :result => results })
  end
end
