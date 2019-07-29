User.as_anonymous_admin do
  RemoteExecutionFeature.without_auditing do
    if Rails.env.test? || Foreman.in_rake?
      # If this file tries to import a template with a REX feature in a SeedsTest,
      # it will fail - the REX feature isn't registered on SeedsTest because
      # DatabaseCleaner truncates the db before every test.
      # During db:seed, we also want to know the feature is registered before
      # seeding the template
      # kudos to dLobatog
      ForemanRemoteExecution.register_rex_feature
    end
    JobTemplate.without_auditing do
      module_template = JobTemplate.find_by(name: 'Puppet Run Once - SSH Default')
      if module_template && !Rails.env.test? && Setting[:remote_execution_sync_templates]
        module_template.sync_feature('puppet_run_host')
        module_template.organizations << Organization.unscoped.all if module_template.organizations.empty?
        module_template.locations << Location.unscoped.all if module_template.locations.empty?
      end
    end
  end
end
