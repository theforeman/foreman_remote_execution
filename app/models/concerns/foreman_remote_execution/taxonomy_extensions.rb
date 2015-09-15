module ForemanRemoteExecution
  module TaxonomyExtensions
    extend ActiveSupport::Concern

    included do
      has_many :job_templates, :through => :taxable_taxonomies, :source => :taxable, :source_type => 'JobTemplate'

      # FIXME Workound until https://github.com/theforeman/foreman/pull/2723
      # is merged.
      alias_method :assign_default_templates, :noop # Disable after_create callback
      before_create :assign_default_templates_workaround
    end

    def noop
    end

    def assign_default_templates_workaround
      Template.where(:default => true).group_by { |t| t.class.to_s.underscore.pluralize }.each do |association, templates|
        self.send("#{association}=", templates)
      end
    end
  end
end
