class JobTemplate < ::Template
  attr_accessible :job_name, :provider_type

  include Authorizable
  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  audited :allow_mass_assignment => true
  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name

  # these can't be shared in parent class, scoped search can't handle STI properly
  # tested with scoped_search 3.2.0
  include Taxonomix
  scoped_search :on => :name, :complete_value => true, :default_order => true
  scoped_search :on => :job_name, :complete_value => true
  scoped_search :on => :locked, :complete_value => {:true => true, :false => false}
  scoped_search :on => :snippet, :complete_value => {:true => true, :false => false}
  scoped_search :on => :provider_type, :complete_value => true
  scoped_search :on => :template

  # with proc support, default_scope can no longer be chained
  # include all default scoping here
  default_scope lambda {
                  with_taxonomy_scope do
                    order("#{Template.table_name}.name")
                  end
                }

  validates :provider_type, :presence => true
  validate :provider_type_whitelist

  # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
  # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
  def self.base_class
    self
  end
  self.table_name = 'templates'

  # Override method in Taxonomix as Template is not used attached to a Host,
  # and matching a Host does not prevent removing a template from its taxonomy.
  def used_taxonomy_ids(type)
    []
  end

  private

  # we can't use standard validator, .provider_names output can change but the validator does not reflect it
  def provider_type_whitelist
    errors.add :provider_type, :uniq unless RemoteExecutionProvider.provider_names.include?(self.provider_type)
  end
end
