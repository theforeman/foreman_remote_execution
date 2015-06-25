class TargetingHost < ActiveRecord::Base

  belongs_to :targeting
  belongs_to_host

  validates :targeting, :presence => true
  validates :host, :presence => true

end
