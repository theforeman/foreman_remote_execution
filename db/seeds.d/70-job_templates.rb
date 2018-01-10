User.as_anonymous_admin do
  JobTemplate.without_auditing do
    organizations = Organization.all
    locations = Location.all
    Dir[File.join("#{ForemanRemoteExecution::Engine.root}/app/views/templates/**/*.erb")].each do |template|
      sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
      template = JobTemplate.import_raw!(File.read(template), :default => true, :locked => true, :update => sync)
      if template.default?
        template.organizations = organizations if SETTINGS[:organizations_enabled]
        template.locations = locations if SETTINGS[:locations_enabled]
      end
    end
  end
end
