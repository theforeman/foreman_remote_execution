view_permission = Permission.find_by(name: "view_job_invocations", resource_type: 'JobInvocation')
default_role = Role.default

# the view_permissions can be nil in tests: skipping in that case
if view_permission && !default_role.permissions.include?(view_permission)
  default_role.filters.create(:search => 'user = current_user') do |filter|
    filter.filterings.build { |f| f.permission = view_permission }
  end
end
