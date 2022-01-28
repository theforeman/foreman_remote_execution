view_permission = Permission.find_by(name: "view_job_invocations", resource_type: 'JobInvocation')
default_role = Role.default

# the view_permissions can be nil in tests: skipping in that case
if view_permission && !default_role.permissions.include?(view_permission)
  default_role.filters.create(:search => 'user = current_user') do |filter|
    filter.filterings.build { |f| f.permission = view_permission }
  end
end

site_manager_role = Role.find_by(name: 'Site manager')
Role.without_auditing do
  Role.skip_permission_check do
    site_manager_role.ignore_locking do |role|
      names = ForemanRemoteExecution::Engine::USER_PERMISSIONS.map(&:to_s) + %w(execute_jobs_on_infrastructure_hosts)
      existing = role.permissions.where(:name => names).pluck(:name)
      to_add = names - existing
      role.add_permissions! to_add if to_add.any?
    end
  end
end
