module ForemanRemoteExecution
  module TaxonomyExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_templates, :through => :taxable_taxonomies, :source => :taxable, :source_type => 'JobTemplate'

      # FIXME - workaround for #11805 - use before_create for setting
      # the default templates, remove after it's fixed in upstream
      # (https://github.com/theforeman/foreman/pull/2723) and we don't
      # support Foreman 1.9
      skip_callback :create, :after, :assign_default_templates
      before_create :assign_default_templates
    end
  end
end
