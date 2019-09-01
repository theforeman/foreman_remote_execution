class JobTemplate < ::Template
  audited
  include ::Exportable
  include ::TemplateTax

  class NonUniqueInputsError < Foreman::Exception
  end

  attr_exportable :job_category, :description_format,
                  :foreign_input_sets, :provider_type,
                  { :kind => ->(template) { template.class.name.underscore } }.merge(taxonomy_exportable)

  include Authorizable
  extend FriendlyId
  friendly_id :name
  include Parameterizable::ByIdName

  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name, :dependent => :nullify
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
  validates_associated :foreign_input_sets

  has_one :effective_user, :class_name => 'JobTemplateEffectiveUser', :foreign_key => 'job_template_id', :dependent => :destroy
  accepts_nested_attributes_for :effective_user, :update_only => true

  class << self
    # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
    # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
    def base_class
      self
    end
    table_name = 'templates'

    # Import a template from ERB, with YAML metadata in the first comment.  It
    # will overwrite (sync) an existing template if options[:update] is true.
    def import_raw(contents, options = {})
      metadata = Template.parse_metadata(contents)
      import_parsed(metadata['name'], contents, metadata, options)
    end

    def import_raw!(contents, options = {})
      template = import_raw(contents, options)
      template.save! if template
      template
    end

    def import_parsed(name, text, _metadata, options = {})
      transaction do
        # Don't look for existing if we should always create a new template
        existing = self.find_by(:name => name) unless options.delete(:build_new)
        # Don't update if the template already exists, unless we're told to
        return if !options.delete(:update) && existing

        template = existing || self.new(:name => name)
        template.import_without_save(text, options)
        template
      end
    end

    def acceptable_template_input_types
      [ :user, :fact, :variable, :puppet_parameter ]
    end

    def default_render_scope_class
      ForemanRemoteExecution::Renderer::Scope::Input
    end
  end

  def validate_unique_inputs!
    duplicated_inputs = template_inputs_with_foreign.group_by(&:name).values.select { |values| values.size > 1 }.map(&:first)
    unless duplicated_inputs.empty?
      raise NonUniqueInputsError.new(N_('Duplicated inputs detected: %{duplicated_inputs}'), :duplicated_inputs => duplicated_inputs.map(&:name))
    end
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

  def assign_taxonomies
    if default
      organizations << Organization.all
      locations << Location.all
    end
  end

  def provider
    RemoteExecutionProvider.provider_for(provider_type)
  end

  def effective_user
    super || build_effective_user.tap(&:set_defaults)
  end

  def generate_description_format
    if description_format.blank?
      generated_description = '%{template_name}'
      unless template_inputs_with_foreign.empty?
        inputs = template_inputs_with_foreign.map(&:name).map { |name| %{#{name}="%{#{name}}"} }.join(' ')
        generated_description << " with inputs #{inputs}"
      end
      generated_description
    else
      description_format
    end
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
    input_sets.each_value { |input_set| self.foreign_input_sets.build(input_set) }
  end

  def sync_feature(feature_name)
    if feature_name && (feature = RemoteExecutionFeature.feature(feature_name)) && feature.job_template.blank?
      self.remote_execution_features << feature
    end
  end

  def import_custom_data(options)
    super
    sync_foreign_input_sets(@importing_metadata['foreign_input_sets'])
    sync_feature(@importing_metadata['feature'])

    %w(job_category description_format provider_type).each do |attribute|
      value = @importing_metadata[attribute]
      self.public_send "#{attribute}=", value if @importing_metadata.key?(attribute)
    end

    # this should be moved to core but meanwhile we support default attribute here
    # see http://projects.theforeman.org/issues/23426 for more details
    self.default = options[:default] unless options[:default].nil?

    # job templates have too long metadata, we remove them on parsing until it's stored in separate attribute
    self.template = self.template.gsub(/<%\#.+?.-?%>\n?/m, '').strip
  end

  def default_input_values(ignore_keys)
    result = self.template_inputs_with_foreign.select { |ti| !ti.required? && ti.user_template_input? }.map { |ti| ti.name.to_s }
    result -= ignore_keys.map(&:to_s)
    Hash[result.map { |k| [ k, nil ] }]
  end

  private

  # we can't use standard validator, .provider_names output can change but the validator does not reflect it
  def provider_type_whitelist
    errors.add :provider_type, :uniq unless RemoteExecutionProvider.provider_names.include?(self.provider_type)
  end
end
