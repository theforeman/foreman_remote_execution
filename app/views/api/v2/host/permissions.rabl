if params.has_key?(:include_permissions)
  node do |resource|
    if resource&.class&.try(:include?, Authorizable)
      node(:can_create_job_invocations) { authorized_for(:auth_object => resource, :authorizer => authorizer, :permission => "create_job_invocations") }
    end
  end
end
