 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['zh_TW'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "FULL NAME <EMAIL@ADDRESS>",
        "Language-Team": "Chinese (Taiwan) (http://www.transifex.com/foreman/foreman/language/zh_TW/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "zh_TW",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "zh_TW",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "另一個介面已設為執行。行您是否確定要使用此介面？"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "更新狀態時發生錯誤，請更新此頁面。"
      ],
      "List foreign input sets": [
        "列出外部輸入集"
      ],
      "Show foreign input set details": [
        "顯示外部輸入集的詳細資料"
      ],
      "Target template ID": [
        "目標範本 ID"
      ],
      "Include all inputs from the foreign template": [
        ""
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "從外部範本納入的輸入名稱清單，以逗號隔開。"
      ],
      "Input set description": [
        "輸入集的描述"
      ],
      "Create a foreign input set": [
        "建立外部輸入集"
      ],
      "Delete a foreign input set": [
        "刪除外部輸入集"
      ],
      "Update a foreign input set": [
        "更新外部輸入集"
      ],
      "List job invocations": [
        "列出工作祈願"
      ],
      "Show job invocation": [
        "顯示工作祈願"
      ],
      "Show Job status for the hosts": [
        ""
      ],
      "The job template to use, parameter is required unless feature was specified": [
        ""
      ],
      "Invocation type, one of %s": [
        "祈願類型，%s 之一"
      ],
      "Execute the jobs on hosts in randomized order": [
        ""
      ],
      "Inputs to use": [
        "要使用的輸入"
      ],
      "SSH provider specific options": [
        "SSH 供應者特定選項"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "哪位使用者該用來執行此 script（使用類似 sudo 機制）。預設值設為範本參數或全域設定。"
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
        "建立週期性工作"
      ],
      "How often the job should occur, in the cron format": [
        "工作多常發生，格式同 cron"
      ],
      "Repeat a maximum of N times": [
        "重複最多 N 次"
      ],
      "Perform no more executions after this time": [
        "此時間之後不再進行任何執行"
      ],
      "Designation of a special purpose": [
        ""
      ],
      "Schedule the job to start at a later time": [
        "排程工作至晚一點的時間"
      ],
      "Schedule the job for a future time": [
        "排程工作至未來時間"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "這表示如果不能在這時間之前開始，就應該取消動作。"
      ],
      "Control concurrency level and distribution over time": [
        "隨時間控制週期等級並散佈"
      ],
      "Run at most N tasks at a time": [
        "一次最多執行 N 個任務"
      ],
      "Override the description format from the template for this invocation only": [
        "僅為這祈願從範本覆寫描述格式"
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
        "建立工作祈願"
      ],
      "Get output for a host": [
        "取得主機輸出"
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
        "找不到 ID 為 '%{id}' 的主機"
      ],
      "Only one of feature or job_template_id can be specified": [
        ""
      ],
      "List job templates": [
        "列出工作範本"
      ],
      "List job templates per location": [
        "列出各個位置上的工作範本"
      ],
      "List job templates per organization": [
        "列出各個組織的工作範本"
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
        "顯示工作範本的詳情"
      ],
      "Template name": [
        "範本名稱"
      ],
      "Job category": [
        "工作類別"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "這範本是用來產生描述。輸入值可以使用 %{package} 語法。您也可以使用 %{job_category} 與 %{template_name} 來包括工作類別與範本名稱。"
      ],
      "Provider type": [
        "供應商種類"
      ],
      "Whether or not the template is locked for editing": [
        "範本是否鎖定並禁止進行編輯"
      ],
      "Effective user options": [
        "有效的使用者選項"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "哪位使用者該用來執行此 script（使用類似 sudo 機制）"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "是否允許從祈願清單覆寫有效使用者。"
      ],
      "Whether the current user login should be used as the effective user": [
        "目前登入的使用者是否應作為有效使用者"
      ],
      "Create a job template": [
        "建立工作範本"
      ],
      "Update a job template": [
        "更新工作範本"
      ],
      "Template version": [
        "範本版本"
      ],
      "Delete a job template": [
        "刪除工作範本"
      ],
      "Clone a provision template": [
        "複製佈建範本"
      ],
      "List remote execution features": [
        "列出遠端執行功能"
      ],
      "Show remote execution feature": [
        "顯示遠端執行功能"
      ],
      "Job template ID to be used for the feature": [
        "要給這功能使用的工作範本 ID"
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
        "預覽範本時發生問題：%{error}。請注意，您必須在預覽範本前，先儲存範本輸入的變更。"
      ],
      "Job template imported successfully.": [
        ""
      ],
      "Unable to save template. Correct highlighted errors": [
        ""
      ],
      "Run": [
        "執行"
      ],
      "Schedule Remote Job": [
        ""
      ],
      "Jobs": [
        "工作"
      ],
      "Job invocations": [
        "工作祈願"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        ""
      ],
      "Success": [
        "成功"
      ],
      "Failed": [
        "已失敗"
      ],
      "Pending": [
        "等待處理中"
      ],
      "Cancelled": [
        "已取消"
      ],
      "queued to start executing in %{time}": [
        ""
      ],
      "queued": [
        "已排程"
      ],
      "running %{percent}%%": [
        ""
      ],
      "succeeded": [
        "已成功"
      ],
      "cancelled": [
        "已取消"
      ],
      "failed": [
        "已失敗"
      ],
      "unknown status": [
        "未知的狀態"
      ],
      "Any Organization": [
        "任何組織"
      ],
      "Any Location": [
        "任何位置"
      ],
      "error": [
        ""
      ],
      "Host detail": [
        "主機詳細資料"
      ],
      "Rerun on %s": [
        "傳回於 %s"
      ],
      "Host task": [
        ""
      ],
      "N/A": [
        "N/A"
      ],
      "Run Job": [
        "執行工作"
      ],
      "Create Report": [
        ""
      ],
      "Create report for this job": [
        ""
      ],
      "Rerun": [
        "重新執行"
      ],
      "Rerun the job": [
        "重新執行工作"
      ],
      "Rerun failed": [
        "重新執行失敗"
      ],
      "Rerun on failed hosts": [
        "在失敗的主機上重新執行"
      ],
      "Job Task": [
        "工作任務"
      ],
      "See the last task details": [
        "檢視最後工作的詳情"
      ],
      "Cancel Job": [
        "取消工作"
      ],
      "Try to cancel the job": [
        "試著取消工作"
      ],
      "Abort Job": [
        ""
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        ""
      ],
      "Task Details": [
        "工作詳細資料"
      ],
      "See the task details": [
        "檢視工作的詳情"
      ],
      "Try to cancel the job on a host": [
        "試著取消主機上的工作"
      ],
      "Try to abort the job on a host without waiting for its result": [
        ""
      ],
      "Could not render the preview because no host matches the search query.": [
        ""
      ],
      "in %s": [
        "%s 中"
      ],
      "%s ago": [
        "%s 之前"
      ],
      "Use default description template": [
        "使用預設的描述範本"
      ],
      "Description template": [
        "描述範本"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        ""
      ],
      "Could not use any template used in the job invocation": [
        "無法使用任何用於這工作祈願的範本"
      ],
      "Failed rendering template: %s": [
        "無法生成範本：%s"
      ],
      "Task cancelled": [
        ""
      ],
      "Job execution failed": [
        ""
      ],
      "%{description} on %{host}": [
        "%{description} 於 %{host} 之上"
      ],
      "Remote action:": [
        "遠端動作："
      ],
      "Job cancelled by user": [
        ""
      ],
      "Exit status: %s": [
        "退出狀態：%s"
      ],
      "Job finished with error": [
        "工作完成但發生錯誤"
      ],
      "Error loading data from proxy": [
        "從代理載入資料時發生錯誤"
      ],
      "User can not execute job on host %s": [
        "使用者無法在主機 %s 上執行工作"
      ],
      "User can not execute this job template": [
        "使用者無法執行此工作範本"
      ],
      "User can not execute job on infrastructure host %s": [
        ""
      ],
      "User can not execute this job template on %s": [
        "使用者無法在 %s 上執行此工作範本"
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
        "找不到包含的範本 '%s'"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "使用了名為 '%s' 的輸入巨集，但此範本並未輸入這樣的名稱"
      ],
      "Unable to fetch public key": [
        "無法取得公開金鑰"
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
        "主機已有執行介面"
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "此範本已鎖定。請將它複製至一個新的範本以自訂化。"
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "在外部輸入集偵測到環狀相依性： '%{template}' -> '%{target_template}'。範本堆疊：%{templates_stack}"
      ],
      "Execution": [
        "執行"
      ],
      "Last execution succeeded": [
        "最後的執行成功"
      ],
      "No execution finished yet": [
        "尚無執行完成"
      ],
      "Last execution cancelled": [
        ""
      ],
      "Last execution failed": [
        "最後的執行失敗"
      ],
      "Unknown execution status": [
        "未知的執行狀態"
      ],
      "Recursive rendering of templates detected": [
        "偵測到遞迴處理範本"
      ],
      "error during rendering: %s": [
        "處理時發生錯誤：%s"
      ],
      "template": [
        "範本"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "無法指定 bookmark_id 和 search_query"
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "未知的輸入 %{input_name} 給範本 %{template_name}"
      ],
      "Template with id '%{id}' was not found": [
        "找不到 ID 為 '%{id}' 的範本"
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "未知的輸入 %{input_name} 未定義於範本 %{template_name}"
      ],
      "No template mapped to feature %{feature_name}": [
        "沒有範本定義至功能 %{feature_name}"
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "使用者無法存取範本 %{template_name} 對應至功能 %{feature_name}"
      ],
      "Job Invocation": [
        "工作祈願"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "偵測到重複的輸入：%{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "未知的遠端執行功能 %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "有效使用者方法 \\\"%{current_value}\\\" 並非 %{valid_methods} 之一"
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
        "靜態查詢"
      ],
      "Dynamic Query": [
        "動態查詢"
      ],
      "Alphabetical": [
        ""
      ],
      "Randomized": [
        ""
      ],
      "Cannot resolve hosts without a user": [
        "沒有使用者就無法解析主機"
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "沒有書籤或搜尋查詢，就無法解析主機"
      ],
      "Must select a bookmark or enter a search query": [
        "必須選擇書籤或輸入搜尋查詢"
      ],
      "Input": [
        "輸入"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "並不是所需的輸入都有值。缺少的輸入：%s"
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
        "名稱"
      ],
      "State": [
        "狀態"
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
        "排程"
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
        "秒"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "目標主機"
      ],
      "Bookmark": [
        "書籤"
      ],
      "Manual selection": [
        "手動選擇"
      ],
      "using ": [
        ""
      ],
      "Execution order": [
        ""
      ],
      "Organization": [
        "組織"
      ],
      "Location": [
        "位置"
      ],
      "SSH User": [
        ""
      ],
      "Evaluated at:": [
        "評量於："
      ],
      "User Inputs": [
        ""
      ],
      "Description": [
        "說明"
      ],
      "Job template": [
        "工作範本"
      ],
      "Resolves to": [
        "解析至"
      ],
      "hosts": [
        "主機"
      ],
      "Refresh": [
        "重新整理"
      ],
      "Preview": [
        "預覽"
      ],
      "Display advanced fields": [
        "顯示進階欄位"
      ],
      "Hide advanced fields": [
        "隱藏進階欄位"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "有效的使用者"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "要使用執行這 script 的使用者。如果使用者與 SSH 使用者不同，會用 su 或 sudo 來切換使用者。"
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
        "密碼"
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
        "同步等級"
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
        "查詢類型"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "最終主機清單可能會改變，因為選擇查詢是動態的。這會在執行時重新執行。"
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "No hosts found.": [
        "找不到主機。"
      ],
      "Close": [
        "關閉"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "動態查詢 '%{query}' 尚未被解析。該解析的主機清單可以在 %{here} 找到。"
      ],
      "here": [
        "這裏"
      ],
      "effective user": [
        ""
      ],
      "Total hosts": [
        "主機總數"
      ],
      "Hosts gone missing": [
        ""
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        ""
      ],
      "Providers and templates": [
        "供應者與範本"
      ],
      "User input": [
        "使用者輸入"
      ],
      "Value": [
        "值"
      ],
      "Search Query": [
        ""
      ],
      "Status": [
        "狀態"
      ],
      "Succeeded": [
        "已成功"
      ],
      "Start": [
        "開始"
      ],
      "Job invocation": [
        "工作祈願"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "概覽"
      ],
      "Preview templates": [
        ""
      ],
      "Recurring logic": [
        "週期邏輯"
      ],
      "Job Invocations": [
        ""
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        ""
      ],
      "Learn more about this in the documentation.": [
        "欲知更多，請參閱文件。"
      ],
      "Job": [
        "工作"
      ],
      "Type": [
        "類型"
      ],
      "Add Foreign Input Set": [
        "新增外部輸入集"
      ],
      "add an input set for this template to reference a different template inputs": [
        "為此範本新增輸入集，以參照至不同的範本輸入"
      ],
      "Snippet": [
        "程式碼片段"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        ""
      ],
      "Overwrite": [
        "覆寫"
      ],
      "Whether to overwrite the template if it already exists": [
        ""
      ],
      "Job Templates": [
        "工作範本"
      ],
      "Edit %s": [
        "編輯 %s"
      ],
      "Edit Job Template": [
        "編輯工作範本"
      ],
      "Import": [
        "匯入"
      ],
      "New Job Template": [
        "新工作範本"
      ],
      "JobTemplate|Name": [
        "JobTemplate|Name"
      ],
      "JobTemplate|Snippet": [
        "JobTemplate|Snippet"
      ],
      "JobTemplate|Locked": [
        "JobTemplate|Locked"
      ],
      "Actions": [
        "動作"
      ],
      "This template is locked for editing.": [
        "此範本已鎖定，因此無法編輯。"
      ],
      "The execution interface is used for remote execution": [
        "用來遠端執行的執行介面"
      ],
      "Remote execution": [
        "遠端執行"
      ],
      "Remote Execution": [
        "遠端執行"
      ],
      "Proxies": [
        "代理伺服器"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "為此子網路儘可能選擇遠端執行代理。加入有著同樣供應者的多重代理之後，動作就會在這些代理上進行負載平衡。"
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "您不能看到目前指定的範本。現在儲存表單會取消指定範本。"
      ],
      "Remote Execution Features": [
        "遠端執行功能"
      ],
      "Label": [
        "標籤"
      ],
      "Edit Remote Execution Feature": [
        "編輯遠端執行功能"
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
        "外部輸入集"
      ],
      "remove template input set": [
        "移除範本輸入集"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "從外部範本排除的輸入名稱清單，以逗號隔開。"
      ],
      "Template Invocation for %s": [
        ""
      ],
      "Back to Job": [
        "回到工作"
      ],
      "Toggle command": [
        "切換指令"
      ],
      "Toggle STDERR": [
        "切換 STDERR"
      ],
      "Toggle STDOUT": [
        "切換 STDOUT"
      ],
      "Toggle DEBUG": [
        "切換 DEBUG"
      ],
      "Target: ": [
        "目標："
      ],
      "using Smart Proxy": [
        ""
      ],
      "Scroll to bottom": [
        "捲動至底端"
      ],
      "Scroll to top": [
        "捲動至頂端"
      ],
      "Could not display data for job invocation.": [
        ""
      ],
      "Unsupported or no operating system found for this host.": [
        "不支援或此主機上找不到作業系統。"
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
        "使用遠端執行為代理搜尋主機，這在主機沒有子網路、或子網路沒有執行代理時很有用"
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
        "使用 SSH 的預設使用者。您可以透過設定參數呼叫 remote_execution_ssh_user 來覆寫每台主機的設定。"
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "要使用執行這 script 的預設使用者。如果使用者與 SSH 使用者不同，會用 su 或 sudo 來切換使用者。"
      ],
      "Effective User": [
        ""
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "該用哪個指令來切換至有效的使用者。%s 之一"
      ],
      "Effective User Method": [
        ""
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "執行 db:seed 時是否要從磁碟同步範本。"
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
        "工作範本"
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
        "每個月"
      ],
      "Weekly": [
        "每週"
      ],
      "Daily": [
        "每天"
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
        "主機"
      ],
      "Host collections": [
        ""
      ],
      "Host groups": [
        "主機群組"
      ],
      "Search query": [
        "搜尋查詢"
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
      "Error": [
        "錯誤"
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
        "永不"
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
        "Cron 行"
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
        "起始"
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "重複"
      ],
      "Ends": [
        "結束"
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
        "是分鐘（範圍：0-59）"
      ],
      "is hour (range: 0-23)": [
        "是小時（範圍：0-23）"
      ],
      "is day of month (range: 1-31)": [
        "是日期（範圍：1-31）"
      ],
      "is month (range: 1-12)": [
        "是月份（範圍：1-12）"
      ],
      "is day of week (range: 0-6)": [
        "是星期幾（範圍：0-6）"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "於"
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
        "建立"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "天"
      ],
      "Days of week": [
        "星期幾"
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
        "開啟"
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
        "重設為預設值"
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
        "已完成"
      ],
      "Running": [
        "執行中"
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
        "是"
      ],
      "no": [
        "否"
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
        "主機"
      ],
      "Active Filters:": [
        ""
      ],
      "Action with sub plans": [
        "有子計畫的動作"
      ],
      "Check for long running tasks": [
        ""
      ],
      "Deliver notifications about long running tasks": [
        ""
      ],
      "Import Puppet classes": [
        "匯入 Puppet 類別"
      ],
      "Import facts": [
        "匯入詳情"
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "將遠端執行帶入 Foreman 的外掛程式，搭配遠端管理功能來完成配置管理。"
      ]
    }
  }
};