module ForemanRemoteExecution
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain(:host_title_actions, :run_button)
      alias_method_chain :multiple_actions, :remote_execution
      alias_method_chain :multiple_actions_select, :remote_execution
    end

    def multiple_actions_with_remote_execution
      # The modal window loads empty page, we hook the custom function
      # to the link later. The ?run_job=true is there just to be able to identify the link
      multiple_actions_without_remote_execution + [[_('Run Job'), 'blank.html?run_job=true']]
    end

    def host_title_actions_with_run_button(*args)
      title_actions(button_group(link_to(_("Run Job"), new_job_invocation_path(:host_ids => [args.first.id]), :id => :run_button)))
      host_title_actions_without_run_button(*args)
    end

    def multiple_actions_select_with_remote_execution(*args)
      # TODO: awful hack to open the job invocation form as a new
      # page rather than using the AJAX inside a modal window.
      # Since we want for this plugin to be compatible with 1.9, we
      # need to monkey patch/js hack for now, but it should be removed
      # after we fix and release http://projects.theforeman.org/issues/11309
      multiple_actions_select_without_remote_execution(*args) +
          <<-JAVASCRIPT.html_safe
      <script>
      $(function () {
        $("#submit_multiple a[onclick*='blank.html?run_job=true']").click(function (e) {
          document.location = "#{new_job_invocation_path}?" + $.param({host_ids: $.foremanSelectedHosts});
        })
      })
      </script>
      JAVASCRIPT
    end
  end
end
