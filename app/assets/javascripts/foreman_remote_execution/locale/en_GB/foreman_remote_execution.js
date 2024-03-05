 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['en_GB'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "0868a4d1af5275b3f70b0a6dac4c99a4, 2016",
        "Language-Team": "English (United Kingdom) (http://www.transifex.com/foreman/foreman/language/en_GB/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "en_GB",
        "Plural-Forms": "nplurals=2; plural=(n != 1);",
        "lang": "en_GB",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=2; plural=(n != 1);"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        ""
      ],
      "There was an error while updating the status, try refreshing the page.": [
        ""
      ],
      "List foreign input sets": [
        ""
      ],
      "Show foreign input set details": [
        ""
      ],
      "Target template ID": [
        ""
      ],
      "Include all inputs from the foreign template": [
        ""
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        ""
      ],
      "Input set description": [
        ""
      ],
      "Create a foreign input set": [
        ""
      ],
      "Delete a foreign input set": [
        ""
      ],
      "Update a foreign input set": [
        ""
      ],
      "List job invocations": [
        ""
      ],
      "Show job invocation": [
        ""
      ],
      "Show Job status for the hosts": [
        ""
      ],
      "The job template to use, parameter is required unless feature was specified": [
        ""
      ],
      "Invocation type, one of %s": [
        ""
      ],
      "Execute the jobs on hosts in randomized order": [
        ""
      ],
      "Inputs to use": [
        ""
      ],
      "SSH provider specific options": [
        ""
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        ""
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        ""
      ],
      "Set SSH user": [
        ""
      ],
      "Set SSH password": [
        ""
      ],
      "Set SSH key passphrase": [
        ""
      ],
      "Create a recurring job": [
        ""
      ],
      "How often the job should occur, in the cron format": [
        ""
      ],
      "Repeat a maximum of N times": [
        ""
      ],
      "Perform no more executions after this time": [
        ""
      ],
      "Designation of a special purpose": [
        ""
      ],
      "Schedule the job to start at a later time": [
        ""
      ],
      "Schedule the job for a future time": [
        ""
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        ""
      ],
      "Control concurrency level and distribution over time": [
        ""
      ],
      "Run at most N tasks at a time": [
        ""
      ],
      "Override the description format from the template for this invocation only": [
        ""
      ],
      "Override the timeout interval from the template for this invocation only": [
        ""
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        ""
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Create a job invocation": [
        ""
      ],
      "Get output for a host": [
        ""
      ],
      "Get raw output for a host": [
        ""
      ],
      "Cancel job invocation": [
        ""
      ],
      "The job could not be cancelled.": [
        ""
      ],
      "Rerun job on failed hosts": [
        ""
      ],
      "Could not rerun job %{id} because its template could not be found": [
        ""
      ],
      "Get outputs of hosts in a job": [
        ""
      ],
      "Host with id '%{id}' was not found": [
        ""
      ],
      "Only one of feature or job_template_id can be specified": [
        ""
      ],
      "List job templates": [
        ""
      ],
      "List job templates per location": [
        ""
      ],
      "List job templates per organization": [
        "List job templates per organisation"
      ],
      "Import a job template from ERB": [
        ""
      ],
      "Template ERB": [
        ""
      ],
      "Overwrite template if it already exists": [
        ""
      ],
      "Export a job template to ERB": [
        ""
      ],
      "Show job template details": [
        ""
      ],
      "Template name": [
        ""
      ],
      "Job category": [
        ""
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        ""
      ],
      "Provider type": [
        ""
      ],
      "Whether or not the template is locked for editing": [
        ""
      ],
      "Effective user options": [
        ""
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        ""
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        ""
      ],
      "Whether the current user login should be used as the effective user": [
        ""
      ],
      "Create a job template": [
        ""
      ],
      "Update a job template": [
        ""
      ],
      "Template version": [
        ""
      ],
      "Delete a job template": [
        ""
      ],
      "Clone a provision template": [
        ""
      ],
      "List remote execution features": [
        ""
      ],
      "Show remote execution feature": [
        ""
      ],
      "Job template ID to be used for the feature": [
        ""
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List template invocations belonging to job invocation": [
        ""
      ],
      "Identifier of the Host interface for Remote execution": [
        ""
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "List of proxy IDs to be used for remote execution": [
        ""
      ],
      "Trying to abort the job": [
        ""
      ],
      "Trying to cancel the job": [
        ""
      ],
      "The job cannot be aborted at the moment.": [
        ""
      ],
      "The job cannot be cancelled at the moment.": [
        ""
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        ""
      ],
      "Job template imported successfully.": [
        ""
      ],
      "Unable to save template. Correct highlighted errors": [
        ""
      ],
      "Run": [
        ""
      ],
      "Schedule Remote Job": [
        ""
      ],
      "Jobs": [
        ""
      ],
      "Job invocations": [
        ""
      ],
      "%s": [
        ""
      ],
      "Web Console": [
        ""
      ],
      "Success": [
        "Success"
      ],
      "Failed": [
        ""
      ],
      "Pending": [
        ""
      ],
      "Cancelled": [
        ""
      ],
      "queued to start executing in %{time}": [
        ""
      ],
      "queued": [
        ""
      ],
      "running %{percent}%%": [
        ""
      ],
      "succeeded": [
        ""
      ],
      "cancelled": [
        ""
      ],
      "failed": [
        ""
      ],
      "unknown status": [
        ""
      ],
      "Any Organization": [
        "Any Organisation"
      ],
      "Any Location": [
        ""
      ],
      "Awaiting start": [
        ""
      ],
      "error": [
        ""
      ],
      "Host detail": [
        ""
      ],
      "Rerun on %s": [
        ""
      ],
      "Host task": [
        ""
      ],
      "N/A": [
        "N/A"
      ],
      "Run Job": [
        ""
      ],
      "Create Report": [
        ""
      ],
      "Create report for this job": [
        ""
      ],
      "Rerun": [
        ""
      ],
      "Rerun the job": [
        ""
      ],
      "Rerun failed": [
        ""
      ],
      "Rerun on failed hosts": [
        ""
      ],
      "Job Task": [
        ""
      ],
      "See the last task details": [
        ""
      ],
      "Cancel Job": [
        ""
      ],
      "Try to cancel the job": [
        ""
      ],
      "Abort Job": [
        ""
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        ""
      ],
      "New UI": [
        ""
      ],
      "Switch to the new job invocation detail UI": [
        ""
      ],
      "Task Details": [
        ""
      ],
      "See the task details": [
        ""
      ],
      "Try to cancel the job on a host": [
        ""
      ],
      "Try to abort the job on a host without waiting for its result": [
        ""
      ],
      "Could not render the preview because no host matches the search query.": [
        ""
      ],
      "in %s": [
        ""
      ],
      "%s ago": [
        "%s ago"
      ],
      "Use default description template": [
        ""
      ],
      "Description template": [
        ""
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        ""
      ],
      "Could not use any template used in the job invocation": [
        ""
      ],
      "Failed rendering template: %s": [
        ""
      ],
      "Task cancelled": [
        ""
      ],
      "Job execution failed": [
        ""
      ],
      "%{description} on %{host}": [
        ""
      ],
      "Remote action:": [
        "Remote action:"
      ],
      "Job cancelled by user": [
        ""
      ],
      "Exit status: %s": [
        ""
      ],
      "Job finished with error": [
        ""
      ],
      "Error loading data from proxy": [
        ""
      ],
      "User can not execute job on host %s": [
        ""
      ],
      "User can not execute this job template": [
        ""
      ],
      "User can not execute job on infrastructure host %s": [
        ""
      ],
      "User can not execute this job template on %s": [
        ""
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "",
        ""
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        ""
      ],
      "REX job has succeeded - %s": [
        ""
      ],
      "REX job has failed - %s": [
        ""
      ],
      "included template '%s' not found": [
        ""
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        ""
      ],
      "Unable to fetch public key": [
        ""
      ],
      "Unable to remove host from known hosts": [
        ""
      ],
      "REX job has finished - %s": [
        ""
      ],
      "Should this interface be used for remote execution?": [
        ""
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        ""
      ],
      "host already has an execution interface": [
        ""
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "This template is locked. Please clone it to a new template to customise."
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        ""
      ],
      "Execution": [
        ""
      ],
      "Last execution succeeded": [
        ""
      ],
      "Last execution cancelled": [
        ""
      ],
      "Last execution failed": [
        ""
      ],
      "Unknown execution status": [
        ""
      ],
      "Recursive rendering of templates detected": [
        ""
      ],
      "error during rendering: %s": [
        ""
      ],
      "template": [
        ""
      ],
      "Cannot specify both bookmark_id and search_query": [
        ""
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        ""
      ],
      "Template with id '%{id}' was not found": [
        ""
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        ""
      ],
      "No template mapped to feature %{feature_name}": [
        ""
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        ""
      ],
      "Job Invocation": [
        ""
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        ""
      ],
      "Unknown remote execution feature %s": [
        ""
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        ""
      ],
      "Could not find any suitable interface for execution": [
        ""
      ],
      "Subscribe to my failed jobs": [
        ""
      ],
      "Subscribe to my succeeded jobs": [
        ""
      ],
      "Subscribe to all my jobs": [
        ""
      ],
      "Script": [
        ""
      ],
      "Static Query": [
        ""
      ],
      "Dynamic Query": [
        ""
      ],
      "Alphabetical": [
        ""
      ],
      "Randomized": [
        ""
      ],
      "Cannot resolve hosts without a user": [
        ""
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        ""
      ],
      "Must select a bookmark or enter a search query": [
        ""
      ],
      "Input": [
        ""
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        ""
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        ""
      ],
      "default_capsule method missing from SmartProxy": [
        ""
      ],
      "Can't find Job Invocation for an id %s": [
        ""
      ],
      "Latest Jobs": [
        ""
      ],
      "Name": [
        "Name"
      ],
      "State": [
        "State"
      ],
      "Started": [
        ""
      ],
      "No jobs available": [
        ""
      ],
      "Results": [
        ""
      ],
      "Schedule": [
        ""
      ],
      "Concurrency level limited to": [
        ""
      ],
      "tasks at a time": [
        ""
      ],
      "Scheduled to start before": [
        ""
      ],
      "Scheduled to start at": [
        ""
      ],
      "Timeout to kill after": [
        ""
      ],
      "seconds": [
        ""
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        ""
      ],
      "Bookmark": [
        ""
      ],
      "Manual selection": [
        ""
      ],
      "using ": [
        ""
      ],
      "Execution order": [
        ""
      ],
      "Organization": [
        "Organisation"
      ],
      "Location": [
        "Location"
      ],
      "SSH User": [
        ""
      ],
      "Evaluated at:": [
        ""
      ],
      "User Inputs": [
        ""
      ],
      "Description": [
        "Description"
      ],
      "Job template": [
        ""
      ],
      "Resolves to": [
        ""
      ],
      "hosts": [
        ""
      ],
      "Refresh": [
        ""
      ],
      "Preview": [
        ""
      ],
      "Display advanced fields": [
        ""
      ],
      "Hide advanced fields": [
        ""
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        ""
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        ""
      ],
      "Timeout to kill": [
        ""
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        ""
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Password": [
        ""
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Private key passphrase": [
        ""
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Effective user password": [
        ""
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Concurrency level": [
        ""
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        ""
      ],
      "Execution ordering": [
        ""
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        ""
      ],
      "Type of query": [
        ""
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        ""
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "No hosts found.": [
        ""
      ],
      "Close": [
        ""
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        ""
      ],
      "here": [
        ""
      ],
      "effective user": [
        ""
      ],
      "Total hosts": [
        ""
      ],
      "Hosts gone missing": [
        ""
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        ""
      ],
      "Providers and templates": [
        ""
      ],
      "User input": [
        ""
      ],
      "Value": [
        "Value"
      ],
      "Search Query": [
        ""
      ],
      "Status": [
        ""
      ],
      "Succeeded": [
        ""
      ],
      "Start": [
        ""
      ],
      "Job invocation": [
        ""
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        ""
      ],
      "Preview templates": [
        ""
      ],
      "Recurring logic": [
        ""
      ],
      "Job Invocations": [
        ""
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        ""
      ],
      "Learn more about this in the documentation.": [
        "Learn more about this in the documentation."
      ],
      "Job": [
        ""
      ],
      "Type": [
        "Type"
      ],
      "Add Foreign Input Set": [
        ""
      ],
      "add an input set for this template to reference a different template inputs": [
        ""
      ],
      "Snippet": [
        ""
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        ""
      ],
      "Overwrite": [
        ""
      ],
      "Whether to overwrite the template if it already exists": [
        ""
      ],
      "Job Templates": [
        ""
      ],
      "Edit %s": [
        "Edit %s"
      ],
      "Edit Job Template": [
        ""
      ],
      "Import": [
        ""
      ],
      "New Job Template": [
        ""
      ],
      "JobTemplate|Name": [
        ""
      ],
      "JobTemplate|Snippet": [
        ""
      ],
      "JobTemplate|Locked": [
        ""
      ],
      "Actions": [
        "Actions"
      ],
      "This template is locked for editing.": [
        ""
      ],
      "The execution interface is used for remote execution": [
        ""
      ],
      "Remote execution": [
        ""
      ],
      "Remote Execution": [
        ""
      ],
      "Proxies": [
        ""
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        ""
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        ""
      ],
      "Remote Execution Features": [
        ""
      ],
      "Label": [
        ""
      ],
      "Edit Remote Execution Feature": [
        ""
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        ""
      ],
      "Job result": [
        ""
      ],
      "Failed hosts": [
        ""
      ],
      "See more details at %s": [
        ""
      ],
      "Foreign input set": [
        ""
      ],
      "remove template input set": [
        ""
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        ""
      ],
      "Template Invocation for %s": [
        ""
      ],
      "Back to Job": [
        ""
      ],
      "Toggle command": [
        ""
      ],
      "Toggle STDERR": [
        ""
      ],
      "Toggle STDOUT": [
        ""
      ],
      "Toggle DEBUG": [
        ""
      ],
      "Target: ": [
        ""
      ],
      "using Smart Proxy": [
        ""
      ],
      "Scroll to bottom": [
        ""
      ],
      "Scroll to top": [
        ""
      ],
      "Could not display data for job invocation.": [
        ""
      ],
      "Unsupported or no operating system found for this host.": [
        ""
      ],
      "A job '%{subject}' has finished successfully": [
        ""
      ],
      "Job Details": [
        ""
      ],
      "A job '%{subject}' has failed": [
        ""
      ],
      "Remote execution job": [
        ""
      ],
      "A notification when a job finishes": [
        ""
      ],
      "Unable to create mail notification: %s": [
        ""
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        ""
      ],
      "Fallback to Any Proxy": [
        ""
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        ""
      ],
      "Enable Global Proxy": [
        ""
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        ""
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        ""
      ],
      "Effective User": [
        ""
      ],
      "What command should be used to switch to the effective user. One of %s": [
        ""
      ],
      "Effective User Method": [
        ""
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        ""
      ],
      "Sync Job Templates": [
        ""
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        ""
      ],
      "SSH Port": [
        ""
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        ""
      ],
      "Connect by IP": [
        ""
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        ""
      ],
      "Prefer IPv6 over IPv4": [
        ""
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        ""
      ],
      "Default SSH password": [
        ""
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        ""
      ],
      "Default SSH key passphrase": [
        ""
      ],
      "Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.": [
        ""
      ],
      "Workers pool size": [
        ""
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        ""
      ],
      "Cleanup working directories": [
        ""
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        ""
      ],
      "Cockpit URL": [
        ""
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        ""
      ],
      "Form Job Template": [
        ""
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        ""
      ],
      "Job Invocation Report Template": [
        ""
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Job templates": [
        ""
      ],
      "Job invocations detail": [
        ""
      ],
      "Run Puppet Once": [
        ""
      ],
      "Perform a single Puppet run": [
        ""
      ],
      "Run Script": [
        ""
      ],
      "Run a script": [
        ""
      ],
      "Not yet": [
        ""
      ],
      "Effective user:": [
        ""
      ],
      "Started at:": [
        ""
      ],
      "SSH user:": [
        ""
      ],
      "Template:": [
        ""
      ],
      "Submit": [
        ""
      ],
      "Next": [
        ""
      ],
      "Back": [
        ""
      ],
      "Start job": [
        ""
      ],
      "Fill all required fields in all the steps": [
        ""
      ],
      "Run on selected hosts": [
        ""
      ],
      "Skip to review step": [
        ""
      ],
      "Fill all required fields in all the steps to start the job": [
        ""
      ],
      "Skip to review": [
        ""
      ],
      "Cancel": [
        ""
      ],
      "Does not repeat": [
        ""
      ],
      "Cronline": [
        ""
      ],
      "Monthly": [
        ""
      ],
      "Weekly": [
        ""
      ],
      "Daily": [
        ""
      ],
      "Hourly": [
        ""
      ],
      "Immediate execution": [
        ""
      ],
      "Future execution": [
        ""
      ],
      "Recurring execution": [
        ""
      ],
      "Category and template": [
        ""
      ],
      "Target hosts and inputs": [
        ""
      ],
      "Advanced fields": [
        ""
      ],
      "Review details": [
        ""
      ],
      "Type of execution": [
        ""
      ],
      "Hosts": [
        "Hosts"
      ],
      "Host collections": [
        ""
      ],
      "Host groups": [
        ""
      ],
      "Search query": [
        ""
      ],
      "Run job": [
        ""
      ],
      "Use old form": [
        ""
      ],
      "Current organization %s is different from job's organization %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current location %s is different from job's location %s. This job may run on different hosts than before.": [
        ""
      ],
      "You are not authorized to perform this action.": [
        ""
      ],
      "Please request the required permissions listed below from a Foreman administrator:": [
        ""
      ],
      "Permission Denied": [
        ""
      ],
      "Proceed Anyway": [
        ""
      ],
      "'Starts before' date must in the future": [
        ""
      ],
      "Please go back to \\\\\\\"Schedule\\\\\\\" - \\\\\\\"Future execution\\\\\\\" step to fix the error": [
        ""
      ],
      "Use legacy form": [
        ""
      ],
      "Edit job description template": [
        ""
      ],
      "Preview job description": [
        ""
      ],
      "For example: 1, 2, 3, 4, 5...": [
        ""
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "All fields are required.": [
        ""
      ],
      "Not available": [
        ""
      ],
      "Access denied": [
        ""
      ],
      "Missing the required permissions: ${missingPermissions.join( ', ' )}": [
        ""
      ],
      "Errors:": [
        ""
      ],
      "Categories list failed with:": [
        ""
      ],
      "Templates list failed with:": [
        ""
      ],
      "Template failed with:": [
        ""
      ],
      "Preview Hosts": [
        ""
      ],
      "...and %s more": [
        ""
      ],
      "%s more": [
        ""
      ],
      "Clear all filters": [
        ""
      ],
      "There are no available input fields for the selected template.": [
        ""
      ],
      "Please select at least one host": [
        ""
      ],
      "Please enter a search query": [
        ""
      ],
      "Please select at least one host collection": [
        ""
      ],
      "Please select at least one host group": [
        ""
      ],
      "Filter by hosts": [
        ""
      ],
      "Filter by host collections": [
        ""
      ],
      "Filter by host groups": [
        ""
      ],
      "Apply to": [
        ""
      ],
      "Never": [
        ""
      ],
      "After %s occurences": [
        ""
      ],
      "Every hour at minute %s": [
        ""
      ],
      "Every day at %s": [
        ""
      ],
      "Every week on %s at %s": [
        ""
      ],
      "Every month on %s at %s": [
        ""
      ],
      "Cron line": [
        "Cron line"
      ],
      "No Target Hosts": [
        ""
      ],
      "view host names": [
        ""
      ],
      "Hide all advanced fields": [
        ""
      ],
      "Show all advanced fields": [
        ""
      ],
      "Schedule type": [
        ""
      ],
      "Recurrence": [
        ""
      ],
      "Starts at": [
        ""
      ],
      "Starts Before": [
        ""
      ],
      "Starts": [
        ""
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        ""
      ],
      "Ends": [
        ""
      ],
      "Purpose": [
        ""
      ],
      "Static query": [
        ""
      ],
      "Dynamic query": [
        ""
      ],
      "Description Template": [
        ""
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        ""
      ],
      "Query type": [
        ""
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        ""
      ],
      "evaluates just after you submit this form": [
        ""
      ],
      "evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it": [
        ""
      ],
      "Cron line (extended)": [
        ""
      ],
      "Cron line format '1 2 3 4 5', where:": [
        ""
      ],
      "is minute (range: 0-59)": [
        ""
      ],
      "is hour (range: 0-23)": [
        ""
      ],
      "is day of month (range: 1-31)": [
        ""
      ],
      "is month (range: 1-12)": [
        ""
      ],
      "is day of week (range: 0-6)": [
        ""
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        ""
      ],
      "Invalid time format": [
        ""
      ],
      "At minute": [
        ""
      ],
      "range: 0-59": [
        ""
      ],
      "Create": [
        ""
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        ""
      ],
      "Days of week": [
        ""
      ],
      "For Future execution a 'Starts at' date or 'Starts before' date must be selected. Immediate execution can be selected in the previous step.": [
        ""
      ],
      "'Starts before' date must be after 'Starts at' date": [
        ""
      ],
      "Clear input": [
        ""
      ],
      "Starts before": [
        ""
      ],
      "End time needs to be after start time": [
        ""
      ],
      "On": [
        ""
      ],
      "After": [
        ""
      ],
      "Repeat amount can only be a positive number": [
        ""
      ],
      "occurences": [
        ""
      ],
      "Select the type of execution": [
        ""
      ],
      "Execute the job now.": [
        ""
      ],
      "Execute the job later, at a scheduled time.": [
        ""
      ],
      "Execute the job on a repeating schedule.": [
        ""
      ],
      "Invalid date": [
        ""
      ],
      "open-help-tooltip-button": [
        ""
      ],
      "Reset to default": [
        ""
      ],
      "Has to be a positive number": [
        ""
      ],
      "Please refine your search.": [
        ""
      ],
      "You have %s results to display. Showing first %s results": [
        ""
      ],
      "Opening job invocation form": [
        ""
      ],
      "%s job has been invoked": [
        ""
      ],
      "Schedule a job": [
        ""
      ],
      "Recent jobs": [
        ""
      ],
      "View all jobs": [
        ""
      ],
      "View finished jobs": [
        ""
      ],
      "View running jobs": [
        ""
      ],
      "View scheduled jobs": [
        ""
      ],
      "Finished": [
        ""
      ],
      "Running": [
        "Running"
      ],
      "Scheduled": [
        ""
      ],
      "No results found": [
        ""
      ],
      "Remote Execution Interface": [
        ""
      ],
      "yes": [
        "yes"
      ],
      "no": [
        "no"
      ],
      "Inherit from host parameter": [
        ""
      ],
      "Yes (override)": [
        ""
      ],
      "No (override)": [
        ""
      ],
      "REX pull mode": [
        ""
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Host": [
        "Host"
      ],
      "Active Filters:": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        ""
      ]
    }
  }
};