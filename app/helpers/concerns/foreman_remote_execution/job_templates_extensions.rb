module ForemanRemoteExecution
  module JobTemplatesExtensions
    def permitted_actions(template)
      original = super(template)

      if template.is_a?(JobTemplate)
        original.unshift(authorized_for(controller: :job_invocations, action: :create) ? link_to(_('Run'), hash_for_new_job_invocation_path(:template_id => template.id).merge(:authorizer => authorizer)) : nil) unless template.snippet
      end

      original
    end
  end
end
