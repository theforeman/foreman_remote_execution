class JobTemplate < ::Template

  attr_accessible :job_name, :provider_type, :description_format, :effective_user_attributes

  include Authorizable
  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  audited :allow_mass_assignment => true
  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name
  has_many :template_invocations, :dependent => :destroy, :foreign_key => 'template_id'

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

  validates :job_name, :presence => true, :unless => ->(job_template) { job_template.snippet }
  validates :provider_type, :presence => true
  validate :provider_type_whitelist
  has_one :effective_user, :class_name => 'JobTemplateEffectiveUser', :foreign_key => 'job_template_id', :dependent => :destroy
  accepts_nested_attributes_for :effective_user, :update_only => true

  # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
  # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
  def self.base_class
    self
  end
  self.table_name = 'templates'

  # Import a template from ERB, with YAML metadata in the first comment
  def self.import(template, options = {})
    metadata = parse_metadata(template)
    return if metadata.blank? || metadata.delete('kind') != 'job_template' || self.find_by_name(metadata['name'])

    inputs = metadata.delete('template_inputs')

    template = self.create(metadata.merge(:template => template.gsub(/<%\#.+?.-?%>\n?/m, '')).merge(options))
    template.assign_taxonomies

    inputs.each do |input|
      template.template_inputs << TemplateInput.create(input)
    end

    template
  end

  # Override method in Taxonomix as Template is not used attached to a Host,
  # and matching a Host does not prevent removing a template from its taxonomy.
  def used_taxonomy_ids(type)
    []
  end

  def dup
    dup = super
    self.template_inputs.each do |input|
      dup.template_inputs.build input.attributes.except('template_id', 'id', 'created_at', 'updated_at')
    end
    dup
  end

  def assign_taxonomies
    if default
      organizations << Organization.all if SETTINGS[:organizations_enabled]
      locations << Location.all if SETTINGS[:locations_enabled]
    end
  end

  def provider
    RemoteExecutionProvider.provider_for(provider_type)
  end

  def effective_user
    super || (build_effective_user.tap(&:set_defaults))
  end

  def generate_description_format
    if description_format.blank?
      generated_description = '%{job_name}'
      unless template_inputs.empty?
        inputs = template_inputs.map(&:name}.map { |name| %Q(#{name}="%{#{name}}") }.join(' ')
        generated_description << " with inputs #{inputs}"
      end
      generated_description
    else
      description_format
    end
  end

  private

  def self.parse_metadata(template)
    match = template.match(/<%\#(.+?).-?%>/m)
    match.nil? ? {} : YAML.load(match[1])
  end

  # we can't use standard validator, .provider_names output can change but the validator does not reflect it
  def provider_type_whitelist
    errors.add :provider_type, :uniq unless RemoteExecutionProvider.provider_names.include?(self.provider_type)
  end
end
