class JobTemplate < ::Template
  include ForemanRemoteExecution::Exportable

  class NonUniqueInputsError < Foreman::Exception
  end

  attr_accessible :job_category, :provider_type, :description_format, :effective_user_attributes
  attr_exportable :name, :job_category, :description_format, :snippet, :template_inputs,
                  :foreign_input_sets, :provider_type, :kind => ->(template) { template.class.name.underscore }

  include Authorizable
  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  audited :allow_mass_assignment => true
  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name
  has_many :all_template_invocations, :dependent => :destroy, :foreign_key => 'template_id', :class_name => 'TemplateInvocation'
  has_many :template_invocations, -> { where('host_id IS NOT NULL') }, :foreign_key => 'template_id'
  has_many :pattern_template_invocations, -> { where('host_id IS NULL') }, :foreign_key => 'template_id', :class_name => 'TemplateInvocation'
  has_many :remote_execution_features, :dependent => :nullify

  # these can't be shared in parent class, scoped search can't handle STI properly
  # tested with scoped_search 3.2.0
  include Taxonomix
  scoped_search :on => :name, :complete_value => true, :default_order => true
  scoped_search :on => :job_category, :complete_value => true
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

  validates :job_category, :presence => true, :unless => ->(job_template) { job_template.snippet }
  validates :provider_type, :presence => true
  validates :name, :uniqueness => true
  validate :provider_type_whitelist
  validate :inputs_unchanged_when_locked, :if => ->(template) { (template.locked? || template.locked_changed?) && template.persisted? && !Foreman.in_rake? }

  validate do
    begin
      validate_unique_inputs!
    rescue Foreman::Exception => e
      errors.add :base, e.message
    end
  end
  validates_associated :foreign_input_sets

  has_one :effective_user, :class_name => 'JobTemplateEffectiveUser', :foreign_key => 'job_template_id', :dependent => :destroy
  accepts_nested_attributes_for :effective_user, :update_only => true

  # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
  # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
  def self.base_class
    self
  end
  self.table_name = 'templates'

  # Import a template from ERB, with YAML metadata in the first comment.  It
  # will overwrite (sync) an existing template if options[:update] is true.
  def self.import(contents, options = {})
    transaction do
      metadata = parse_metadata(contents)
      return if metadata.blank? || metadata.delete('kind') != 'job_template'

      # Don't look for existing if we should always create a new template
      existing = self.find_by_name(metadata['name']) unless options.delete(:build_new)
      # Don't update if the template already exists, unless we're told to
      return if !options.delete(:update) && existing

      template = existing || self.new
      template.sync_inputs(metadata.delete('template_inputs'))
      template.sync_foreign_input_sets(metadata.delete('foreign_input_sets'))
      template.sync_feature(metadata.delete('feature'))
      template.assign_attributes(metadata.merge(:template => contents.gsub(/<%\#.+?.-?%>\n?/m, '').strip).merge(options))
      template.assign_taxonomies if template.new_record?

      template
    end
  end

  def self.import!(template, options = {})
    template = import(template, options)
    template.save! if template
    template
  end

  def metadata
    "<%#\n#{to_export(false).to_yaml.sub(/\A---$/, '').strip}\n%>\n\n"
  end

  # 'Package Action - SSH Default' => 'package_action_ssh_default.erb'
  def filename
    name.downcase.delete('-').gsub(/\s+/, '_') + '.erb'
  end

  def to_erb
    metadata + template
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
      generated_description = '%{job_category}'
      unless template_inputs_with_foreign.empty?
        inputs = template_inputs_with_foreign.map(&:name).map { |name| %{#{name}="%{#{name}}"} }.join(' ')
        generated_description << " with inputs #{inputs}"
      end
      generated_description
    else
      description_format
    end
  end

  def validate_unique_inputs!
    duplicated_inputs = template_inputs_with_foreign.group_by(&:name).values.select { |values| values.size > 1 }.map(&:first)
    unless duplicated_inputs.empty?
      raise NonUniqueInputsError.new(N_('Duplicated inputs detected: %{duplicated_inputs}'), :duplicated_inputs => duplicated_inputs.map(&:name))
    end
  end

  def sync_inputs(inputs)
    inputs ||= []
    # Build a hash where keys are input names
    inputs = inputs.inject({}) { |h, input| h.update(input['name'] => input) }

    # Sync existing inputs
    template_inputs.each do |existing_input|
      if inputs.include?(existing_input.name)
        existing_input.assign_attributes(inputs.delete(existing_input.name))
      else
        existing_input.mark_for_destruction
      end
    end

    # Create new inputs
    inputs.values.each { |new_input| template_inputs.build(new_input) }
  end

  def sync_foreign_input_sets(input_sets)
    input_sets ||= []

    input_sets = input_sets.inject({}) do |h, input_set|
      target_template = JobTemplate.find_by!(:name => input_set.delete('template'))
      input_set['target_template_id'] = target_template.id
      h.update(target_template.id => input_set)
    end

    # Sync existing input sets
    foreign_input_sets.each do |existing_input_set|
      if input_sets.include?(existing_input_set.target_template_id)
        existing_input_set.assign_attributes(input_sets.delete(existing_input_set.target_template_id))
      else
        existing_input_set.mark_for_destruction
      end
    end

    # Create new input_sets
    input_sets.values.each { |input_set| self.foreign_input_sets.build(input_set) }
  end

  def sync_feature(feature_name)
    if feature_name && (feature = RemoteExecutionFeature.feature(feature_name))
      feature.job_template ||= self
    end
  end

  def self.parse_metadata(template)
    match = template.match(/<%\#(.+?).-?%>/m)
    match.nil? ? {} : YAML.load(match[1])
  end

  private

  # we can't use standard validator, .provider_names output can change but the validator does not reflect it
  def provider_type_whitelist
    errors.add :provider_type, :uniq unless RemoteExecutionProvider.provider_names.include?(self.provider_type)
  end

  def inputs_unchanged_when_locked
    inputs_changed = template_inputs.any? { |input| input.changed? || input.new_record? }
    foreign_input_sets_changed = foreign_input_sets.any? { |input_set| input_set.changed? || input_set.new_record? }
    if inputs_changed || foreign_input_sets_changed
      errors.add(:base, _('This template is locked. Please clone it to a new template to customize.'))
    end
  end
end
