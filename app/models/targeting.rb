class Targeting < ActiveRecord::Base

  STATIC_TYPE = 'static_query'
  DYNAMIC_TYPE = 'dynamic_query'
  TYPES = { STATIC_TYPE => N_('Static Query'), DYNAMIC_TYPE => N_('Dynamic Query') }
  RESOLVE_PERMISSION = :view_hosts

  belongs_to :user
  belongs_to :bookmark

  has_many :targeting_hosts, :dependent => :destroy
  has_many :hosts, :through => :targeting_hosts
  has_one :job_invocation
  has_many :template_invocations, :through => :job_invocation

  validates :targeting_type, :presence => true, :inclusion => Targeting::TYPES.keys
  validate :bookmark_or_query_is_present

  before_create :assign_search_query, :if => :static?

  def clone
    if static?
      self.dup
    else
      Targeting.new(
        :user => self.user,
        :bookmark_id => self.bookmark.try(:id),
        :targeting_type => self.targeting_type,
        :search_query => self.search_query
      )
    end.tap(&:save)
  end

  def resolve_hosts!
    raise ::Foreman::Exception, _('Cannot resolve hosts without a user') if user.nil?
    raise ::Foreman::Exception, _('Cannot resolve hosts without a bookmark or search query') if bookmark.nil? && search_query.blank?

    self.search_query = bookmark.query if dynamic? && bookmark.present?
    self.resolved_at = Time.zone.now
    self.validate!
    # avoid validation of hosts objects - tey will be loaded for no reason.
    host_ids = User.as(user.login) { Host.authorized(RESOLVE_PERMISSION, Host).search_for(search_query).pluck(:id) }
    # this can be optimized even more, by introducing bulk insert
    self.targeting_hosts.build(host_ids.map { |id| { :host_id => id } })
    self.save(:validate => false)
  end

  def dynamic?
    targeting_type == DYNAMIC_TYPE
  end

  def static?
    targeting_type == STATIC_TYPE
  end

  def self.build_query_from_hosts(ids)
    return '' if ids.empty?
    hosts = Host.where(:id => ids).distinct.pluck(:name)
    "name ^ (#{hosts.join(', ')})"
  end

  def resolved?
    self.resolved_at.present?
  end

  private

  def bookmark_or_query_is_present
    if bookmark.blank? && search_query.blank?
      errors.add :bookmark_id, _('Must select a bookmark or enter a search query')
      errors.add :search_query, _('Must select a bookmark or enter a search query')
    end
  end

  def assign_search_query
    self.search_query = bookmark.query if static? && bookmark
  end
end
