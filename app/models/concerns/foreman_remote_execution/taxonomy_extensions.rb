module ForemanRemoteExecution
  module TaxonomyExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_templates, :through => :taxable_taxonomies, :source => :taxable, :source_type => 'JobTemplate'
    end
  end
end
