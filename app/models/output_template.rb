class OutputTemplate < ::Template
  audited
  include Taxonomix
  include Authorizable

  scoped_search :on => :id, :complete_enabled => false, :only_explicit => true, :validator => ScopedSearch::Validators::INTEGER
  scoped_search :on => :name, :complete_value => true, :default_order => true
  scoped_search :on => :locked, :complete_value => {:true => true, :false => false}
  scoped_search :on => :snippet, :complete_value => {:true => true, :false => false}

  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name, :dependent => :nullify
  validates :name, :uniqueness => true
  validates :template, :presence => true

  has_many :job_invocation_templates, dependent: :destroy
  has_many :job_invocations, through: :job_invocation_templates

  has_many :job_template_output_templates, dependent: :destroy
  has_many :job_templates, through: :job_template_output_templates

  class << self
    # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
    # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
    def base_class
      self
    end

    # allows importing templates in the controller
    def import_raw(contents, options = {})
      metadata = Template.parse_metadata(contents)
      import_parsed(metadata['name'], contents, metadata, options)
    end

    def import_raw!(contents, options = {})
      template = import_raw(contents, options)
      template&.save!
      template
    end

    def import_parsed(name, text, _metadata, options = {})
      transaction do
        # Do not search for duplicates in case we want to always create new template
        existing = self.find_by(:name => name) if !options.delete(:build_new)
        # Do not save duplicates
        return unless options.delete(:update) && existing

        template = existing || self.new(:name => name)
        template.import_without_save(text, options)
        template
      end
    end
  end

  def default_input_values(ignore_keys)
    return {}
  end
end
