module ForemanRemoteExecution
  module JobTemplatesExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain :permitted_actions, :run_button
    end

    def permitted_actions_with_run_button(template)
      original = permitted_actions_without_run_button(template)

      if template.is_a?(JobTemplate)
        original.unshift(display_link_if_authorized(_('Export'), hash_for_export_job_template_path(:id => template.id), 'data-no-turbolink' => true))
        original.unshift(display_link_if_authorized(_('Run'), hash_for_new_job_invocation_path(:template_id => template.id))) unless template.snippet
      end

      original
    end
  end
end
