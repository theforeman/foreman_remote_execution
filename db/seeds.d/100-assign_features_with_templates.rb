User.as_anonymous_admin do
  JobTemplate.without_auditing do
    module_template = JobTemplate.find_by(name: 'Puppet Run Once - SSH Default')
    if module_template
      module_template.sync_feature('puppet_run_host')
      module_template.organizations << Organization.unscoped.all if module_template.organizations.empty?
      module_template.locations << Location.unscoped.all if module_template.locations.empty?
    end
  end
end
