class JobAction < ApplicationRecord
  include Authorizable

  belongs_to :job_template
  belongs_to :user
  before_validation :set_user

  validates :name, :job_template, :user, presence: true

  def template_name
    self.job_template.name
  end

  def category
    self.job_template.job_category
  end

  def provider
    self.job_template.provider_type
  end

  def set_user
    self.user = User.current
  end
end
