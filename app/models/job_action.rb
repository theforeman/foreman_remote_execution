class JobAction < ApplicationRecord
  include Authorizable

  belongs_to :job_template

  validates :job_template, presence: true
  validates :name, presence: true, uniqueness: true

  def template_name
    self.job_template.name
  end

  def category
    self.job_template.job_category
  end

  def provider
    self.job_template.provider_type
  end
end
