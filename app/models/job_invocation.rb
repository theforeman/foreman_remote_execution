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
end
