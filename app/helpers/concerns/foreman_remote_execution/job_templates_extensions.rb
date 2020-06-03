module ForemanRemoteExecution
  module JobTemplatesExtensions
    def permitted_actions(template)
      original = super(template)

      if template.is_a?(JobTemplate) && !template.snippet
        original.unshift(display_link_if_authorized(_('Create Job Action'), hash_for_new_job_action_path(:job_template_id => template.id)))
        original.unshift(display_link_if_authorized(_('Run'), hash_for_new_job_invocation_path(:template_id => template.id).merge(:authorizer => authorizer)))
      end

      original
    end
  end
end
