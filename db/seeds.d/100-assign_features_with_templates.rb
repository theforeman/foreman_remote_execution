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
    if !Rails.env.test? && Setting[:remote_execution_sync_templates]
      JobTemplate.without_auditing do
        names = {'Puppet Run Once - SSH Default' => 'puppet_run_host', 'Update Smart Proxy - Script Default' => 'update_smart_proxy' }
        names.each do |name, feature|
          module_template = JobTemplate.find_by(name: name)
          if module_template
            module_template.sync_feature(feature)
            module_template.organizations << Organization.unscoped.all if module_template.organizations.empty?
            module_template.locations << Location.unscoped.all if module_template.locations.empty?
          end
        end
      end
    end
  end
end
