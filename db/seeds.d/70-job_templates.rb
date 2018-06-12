organizations = Organization.unscoped.all
locations = Location.unscoped.all
User.as_anonymous_admin do
  JobTemplate.without_auditing do
    Dir[File.join("#{ForemanRemoteExecution::Engine.root}/app/views/templates/**/*.erb")].each do |template|
      sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
      template = JobTemplate.import_raw!(File.read(template), :default => true, :locked => true, :update => sync)
      template.organizations = organizations if SETTINGS[:organizations_enabled] && template.present?
      template.locations = locations if SETTINGS[:locations_enabled] && template.present?
    end
  end
end
