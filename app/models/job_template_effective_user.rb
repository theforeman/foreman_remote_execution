class JobTemplateEffectiveUser < ActiveRecord::Base

  belongs_to :job_template

  before_validation :set_defaults

  def set_defaults
    self.overridable = true if self.overridable.nil?
    self.current_user = false if self.current_user.nil?
  end

  def compute_value
    if current_user?
      User.current.login
    elsif value.present?
      value
    else
      Setting[:remote_execution_effective_user]
    end
  end
end
