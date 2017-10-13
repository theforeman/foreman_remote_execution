module ForemanRemoteExecution
  module TaxonomyExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_templates, :through => :taxable_taxonomies, :source => :taxable, :source_type => 'JobTemplate'

      # TODO: on foreman_version_bump
      # workaround for #11805 - use before_create for setting
      # the default templates, remove after it's fixed in upstream
      # (https://github.com/theforeman/foreman/pull/4890) and gets
      # into a 1.17 release
      skip_options = Rails::VERSION::MAJOR < 5 ? {} : { :raise => false }
      skip_callback :create, :after, :assign_default_templates, skip_options
      before_create :assign_default_templates
    end
  end
end
