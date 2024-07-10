 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['zh_CN'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "FULL NAME <EMAIL@ADDRESS>",
        "Language-Team": "Chinese (China) (http://www.transifex.com/foreman/foreman/language/zh_CN/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "zh_CN",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "zh_CN",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "${d.title} ${d.count} hosts": [
        ""
      ],
      "%s": [
        "%s"
      ],
      "%s ago": [
        "%s 前"
      ],
      "%s job has been invoked": [
        "%s 任务已被调用"
      ],
      "%s more": [
        ""
      ],
      "%{description} on %{host}": [
        "%{host} 的 %{description}"
      ],
      "'Starts before' date must be after 'Starts at' date": [
        ""
      ],
      "'Starts before' date must in the future": [
        ""
      ],
      "...and %s more": [
        "...和 %s 个更多"
      ],
      "...and %{count} more": [
        "...和 %{count} 个更多"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "以逗号分隔的输入名称列表，将从外部模板中排除。"
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "要从外部模板中包含的输入名称的列表，以逗号分隔。"
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        "作业 '%{job_name}' 的 %%{status}（在 %%{time}）"
      ],
      "A job '%{subject}' has failed": [
        "作业 '%%{subject}' 已失败"
      ],
      "A job '%{subject}' has finished successfully": [
        "作业 '%{subject}' 已成功完成"
      ],
      "A notification when a job finishes": [
        "作业完成后的通知"
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "一个将远程执行带到 Foreman 的插件，通过远程管理功能来完成配置管理功能。"
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        "用于跟踪周期性作业的特殊标签。一次只能有一个具有给定目的的活跃作业。"
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "要使用執行這 script 的使用者。如果使用者與 SSH 使用者不同，會用 su 或 sudo 來切換使用者。"
      ],
      "Abort": [
        ""
      ],
      "Abort Job": [
        "终止作业"
      ],
      "Access denied": [
        ""
      ],
      "Actions": [
        "操作"
      ],
      "Active Filters:": [
        ""
      ],
      "Add Foreign Input Set": [
        "添加外部输入集"
      ],
      "Advanced fields": [
        "高级项"
      ],
      "After": [
        ""
      ],
      "After %s occurences": [
        ""
      ],
      "All fields are required.": [
        "各个项都需要。"
      ],
      "Alphabetical": [
        "按字母"
      ],
      "Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.": [
        "在池中用来处理远程执行任务的工作节点的数量。需要重启 dynflowd/foreman-tasks 服务。"
      ],
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "已经将另一个接口设置为执行。您确定要改用这个吗？"
      ],
      "Any Location": [
        "任意位置"
      ],
      "Any Organization": [
        "任意机构"
      ],
      "Apply to": [
        "应用到"
      ],
      "At": [
        "位于"
      ],
      "At minute": [
        "于分钟"
      ],
      "Awaiting start": [
        ""
      ],
      "Back": [
        ""
      ],
      "Back to Job": [
        "回到作业"
      ],
      "Bookmark": [
        "书签"
      ],
      "Can't find Job Invocation for an id %s": [
        "无法为 ID %s 找到作业调用"
      ],
      "Cancel": [
        ""
      ],
      "Cancel Job": [
        "取消作业"
      ],
      "Cancel job invocation": [
        "取消作业调用"
      ],
      "Cancel recurring": [
        ""
      ],
      "Canceled:": [
        ""
      ],
      "Cancelled": [
        "已取消"
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "无法解析没有书签或搜索查询的主机"
      ],
      "Cannot resolve hosts without a user": [
        "无法解析没有用户的主机"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "无法同时指定 bookmark_id 和 search_query"
      ],
      "Categories list failed with:": [
        "类别列表失败并带有："
      ],
      "Category and template": [
        ""
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        "选择在作业调用表单中预先选择的作业模板"
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "在外部输入设置中发现了循环的依赖关系 '%{template}' -> '%{target_template}'。模板堆栈：%{templates_stack}"
      ],
      "Cleanup working directories": [
        "清理工作目录"
      ],
      "Clear all filters": [
        ""
      ],
      "Clear input": [
        ""
      ],
      "Clone a provision template": [
        "克隆置备模板"
      ],
      "Close": [
        "关闭"
      ],
      "Cockpit URL": [
        "Cockpit URL"
      ],
      "Concurrency level": [
        "并发等級"
      ],
      "Concurrency level limited to": [
        "对...的并发等级限制"
      ],
      "Connect by IP": [
        "按 IP 连接"
      ],
      "Control concurrency level and distribution over time": [
        "控制并发级别和时间分布"
      ],
      "Could not abort the job %s: ${response}": [
        ""
      ],
      "Could not cancel recurring logic %s: ${response}": [
        ""
      ],
      "Could not cancel the job %s: ${response}": [
        ""
      ],
      "Could not disable recurring logic %s: ${response}": [
        ""
      ],
      "Could not display data for job invocation.": [
        "无法显示用于作业调用的数据。"
      ],
      "Could not enable recurring logic %s: ${response}": [
        ""
      ],
      "Could not find any suitable interface for execution": [
        "无法找到适合执行的接口"
      ],
      "Could not render the preview because no host matches the search query.": [
        "由于没有主机匹配搜索查询，因此无法呈现预览。"
      ],
      "Could not rerun job %{id} because its template could not be found": [
        "无法重新运行作业 %{id}，因为它的模板没有找到"
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        "无法为 %%{provider} 作业使用任何代理。考虑在设置中配置 %{global_proxy} 和 %{fallback_proxy}"
      ],
      "Could not use any template used in the job invocation": [
        "无法使用作业调用中使用的任何模板"
      ],
      "Create": [
        "创建"
      ],
      "Create Report": [
        "创建报告"
      ],
      "Create a foreign input set": [
        "建立外部输入集"
      ],
      "Create a job invocation": [
        "创建一个作业调用"
      ],
      "Create a job template": [
        "创建作业模板"
      ],
      "Create a recurring job": [
        "创建一个重复运行的作业"
      ],
      "Create report": [
        ""
      ],
      "Create report for this job": [
        "为这个作业创建报告"
      ],
      "Cron line": [
        "Cron 行"
      ],
      "Cron line (extended)": [
        ""
      ],
      "Cron line format '1 2 3 4 5', where:": [
        ""
      ],
      "Cronline": [
        "Cronline"
      ],
      "Current location %s is different from job's location %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        "当前位置 ％{loc_c} 与作业位置 ％{loc_j} 不同。"
      ],
      "Current organization %s is different from job's organization %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        "当前机构 ％{org_c} 与作业机构 ％{org_j} 不同。"
      ],
      "Daily": [
        "每日"
      ],
      "Days": [
        "天"
      ],
      "Days of week": [
        "星期几"
      ],
      "Default SSH key passphrase": [
        "默认的 SSH 密钥口令"
      ],
      "Default SSH password": [
        "默认 SSH 密码"
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        "SSH 默认使用的密钥口令。可通过设置名为 remote_execution_ssh_key_passphrase 的参数来按主机覆盖"
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        "SSH 默认使用的密码。可通过设置名为 remote_execution_ssh_password 的参数来按主机覆盖"
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        "SSH 默认使用的用户。可通过设置名为 remote_execution_ssh_user 的参数来按主机覆盖"
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "用于执行脚本的默认用户。如果用户与 SSH 用户不同，则使用 su 或 sudo 切换用户。"
      ],
      "Delete a foreign input set": [
        "删除外部输入集"
      ],
      "Delete a job template": [
        "删除作业模板"
      ],
      "Description": [
        "描述"
      ],
      "Description Template": [
        "描述模板"
      ],
      "Description template": [
        "描述模板"
      ],
      "Designation of a special purpose": [
        "设计特殊目的"
      ],
      "Disable recurring": [
        ""
      ],
      "Display advanced fields": [
        "显示高级字段"
      ],
      "Does not repeat": [
        "没有创建"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "检测到重复的输入：％{duplicated_inputs}"
      ],
      "Dynamic Query": [
        "动态查询"
      ],
      "Dynamic query": [
        "动态查询"
      ],
      "Edit %s": [
        "编辑 %s"
      ],
      "Edit Job Template": [
        "编辑作业模板"
      ],
      "Edit Remote Execution Feature": [
        "编辑远程执行功能"
      ],
      "Edit job description template": [
        "编辑作业描述模板"
      ],
      "Effective User": [
        "有效用户"
      ],
      "Effective User Method": [
        "有效用户方法"
      ],
      "Effective user": [
        "有效的用户"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "有效的用户方法 \\\"%{current_value}\\\" 不是 %{valid_methods} 之一"
      ],
      "Effective user options": [
        "有效的用户选项"
      ],
      "Effective user password": [
        "有效用户密码"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "有效用户密码只适用于 SSH 提供商。其他提供商会忽略此字段。<br>在任务完成之前，密码会以加密方式存储在数据库中。对于未来或周期性执行，该密码将在最后一次执行后删除。"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "有效用户密码只适用于 SSH 提供商。其他提供商会忽略此字段。在任务完成之前，密码会以加密方式存储在数据库中。对于未来或周期性执行，该密码将在最后一次执行后删除。"
      ],
      "Effective user:": [
        ""
      ],
      "Enable Global Proxy": [
        "启用全局代理服务器"
      ],
      "Enable recurring": [
        ""
      ],
      "End time needs to be after start time": [
        "结束时间需要在开始时间后"
      ],
      "Ends": [
        "结束"
      ],
      "Error loading data from proxy": [
        "从代理加载数据时出错"
      ],
      "Errors:": [
        "错误："
      ],
      "Evaluated at:": [
        "评估于："
      ],
      "Every day at %s": [
        ""
      ],
      "Every hour at minute %s": [
        ""
      ],
      "Every month on %s at %s": [
        ""
      ],
      "Every week on %s at %s": [
        ""
      ],
      "Execute the job later, at a scheduled time.": [
        ""
      ],
      "Execute the job now.": [
        ""
      ],
      "Execute the job on a repeating schedule.": [
        ""
      ],
      "Execute the jobs on hosts in randomized order": [
        "以随机顺序在主机上执行作业"
      ],
      "Execution": [
        "执行"
      ],
      "Execution order": [
        "执行顺序"
      ],
      "Execution ordering": [
        "执行顺序"
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        "执行顺序确定了应按字母顺序还是随机顺序在主机上执行作业。<br><ul><li><b>Ordered</b> - 以字母顺序在主机上执行作业</li><li><b>Randomized</b> - 以随机顺序在主机上执行作业</li></ul>"
      ],
      "Exit status: %s": [
        "退出状态：%s"
      ],
      "Export a job template to ERB": [
        "把作业模板导出到 ERB"
      ],
      "Failed": [
        "失败"
      ],
      "Failed hosts": [
        "失败的主机"
      ],
      "Failed rendering template: %s": [
        "呈现模板失败：%s"
      ],
      "Failed:": [
        ""
      ],
      "Fallback to Any Proxy": [
        "退回至任何代理服务器"
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "功能输入％{input_name} 未在模板％{template_name} 中定义"
      ],
      "Fill all required fields in all the steps": [
        ""
      ],
      "Fill all required fields in all the steps to start the job": [
        ""
      ],
      "Filter by host collections": [
        "按主机集过滤"
      ],
      "Filter by host groups": [
        "按主机组过滤"
      ],
      "Filter by hosts": [
        "按主机过滤"
      ],
      "Finished": [
        "完成"
      ],
      "For Future execution a 'Starts at' date or 'Starts before' date must be selected. Immediate execution can be selected in the previous step.": [
        ""
      ],
      "For example: 1, 2, 3, 4, 5...": [
        "例如：1, 2, 3, 4, 5..."
      ],
      "Foreign input set": [
        "外来输入集"
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        "Foreman 可以在远程主机上使用不同的方法（如 SSH 或 Ansible）运行命令。网络交流会通过智能代理进行，因此 Foreman 不需要直接访问目标主机，并可以扩展来控制多个主机。"
      ],
      "Form Job Template": [
        "来自作业模板"
      ],
      "Future execution": [
        ""
      ],
      "Get output for a host": [
        "获取主机的输出"
      ],
      "Get outputs of hosts in a job": [
        "获取作业中主机的输出"
      ],
      "Get raw output for a host": [
        "获取主机的原始输出"
      ],
      "Has to be a positive number": [
        "必须为一个正数"
      ],
      "Hide advanced fields": [
        "隐藏高级字段"
      ],
      "Hide all advanced fields": [
        "隐藏所有高级字段"
      ],
      "Host": [
        "主机"
      ],
      "Host collections": [
        "主机集合"
      ],
      "Host detail": [
        "主机详情"
      ],
      "Host groups": [
        "主机组"
      ],
      "Host task": [
        "主机任务"
      ],
      "Host with id '%{id}' was not found": [
        "找不到 id 为 '%{id}' 的主机"
      ],
      "Hosts": [
        "主机"
      ],
      "Hosts gone missing": [
        "主机丢失"
      ],
      "Hourly": [
        "每小时"
      ],
      "How often the job should occur, in the cron format": [
        "作业运行的频率，使用 cron 格式"
      ],
      "Identifier of the Host interface for Remote execution": [
        "主机接口的标识符，用于远程执行"
      ],
      "Immediate execution": [
        ""
      ],
      "Import": [
        "导入"
      ],
      "Import a job template from ERB": [
        "从 ERB 导入作业模版"
      ],
      "In Progress:": [
        ""
      ],
      "Include all inputs from the foreign template": [
        "在外部模板中包含所有输入格式"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "这代表，如果操作无法在这个时间前开始则操作应该被取消。"
      ],
      "Inherit from host parameter": [
        "从主机参数继承"
      ],
      "Input": [
        "输入"
      ],
      "Input set description": [
        "输入集描述"
      ],
      "Inputs to use": [
        "要使用的輸入"
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        "带有'%s'标识符的接口被指定为远程执行接口，但是在主机上找不到该接口。如果该接口存在，则需要在注册过程中在 Foreman 中创建该接口。"
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        "如果启用了Katello，则只能使用内部代理选择器"
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Invalid date": [
        "无效的日期"
      ],
      "Invalid time format": [
        "无效的时间格式"
      ],
      "Invocation type, one of %s": [
        "调用类型，%s 其中之一"
      ],
      "Job": [
        "任务"
      ],
      "Job Details": [
        "作业详情"
      ],
      "Job Invocation": [
        "作业调用"
      ],
      "Job Invocation Report Template": [
        "作业调用报告模板"
      ],
      "Job Invocations": [
        "作业调用"
      ],
      "Job Task": [
        "作业任务"
      ],
      "Job Templates": [
        "作业模板"
      ],
      "Job cancelled by user": [
        "作业被用户取消"
      ],
      "Job category": [
        "作业类别"
      ],
      "Job execution failed": [
        "作业执行失败"
      ],
      "Job finished with error": [
        "作业完成但带有错误"
      ],
      "Job invocation": [
        "工作调用"
      ],
      "Job invocations": [
        "作业调用"
      ],
      "Job invocations detail": [
        ""
      ],
      "Job result": [
        "作业结果"
      ],
      "Job template": [
        "作业模板"
      ],
      "Job template ID to be used for the feature": [
        "用于功能的作业模板 ID"
      ],
      "Job template imported successfully.": [
        "成功导入作业模版。"
      ],
      "Job templates": [
        "作业模板"
      ],
      "JobTemplate|Locked": [
        "JobTemplate|Locked"
      ],
      "JobTemplate|Name": [
        "JobTemplate|Name"
      ],
      "JobTemplate|Snippet": [
        "JobTemplate|Snippet"
      ],
      "Jobs": [
        "工作"
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "密钥口令只适用于 SSH 提供商。其他提供商会忽略此字段。<br>在任务完成之前，都会以加密方式存储在数据库中。对于未来或周期性执行，该密码将在最后一次执行后被删除。"
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "密钥口令只适用于 SSH 提供商。其他提供商会忽略此字段。在任务完成之前，都会以加密方式存储在数据库中。对于未来或周期性执行，该密码将在最后一次执行后被删除。"
      ],
      "Label": [
        "标签"
      ],
      "Last execution cancelled": [
        "最后的执行已取消"
      ],
      "Last execution failed": [
        "最后的执行失败"
      ],
      "Last execution succeeded": [
        "最后成功的执行"
      ],
      "Latest Jobs": [
        "最新的作业"
      ],
      "Learn more about this in the documentation.": [
        "如需了解更多信息，请参阅文档。"
      ],
      "Legacy UI": [
        ""
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List foreign input sets": [
        "列出外部输入集"
      ],
      "List job invocations": [
        "列出作业调用"
      ],
      "List job templates": [
        "列出作业模板"
      ],
      "List job templates per location": [
        "列出各個位置上的工作範本"
      ],
      "List job templates per organization": [
        "列出每个机构的作业模板"
      ],
      "List of proxy IDs to be used for remote execution": [
        "用于远程执行的代理 ID 列表"
      ],
      "List remote execution features": [
        "列出远程执行功能"
      ],
      "List template invocations belonging to job invocation": [
        "列出属于作业调用的模板调用"
      ],
      "Location": [
        "位置"
      ],
      "Manual selection": [
        "手动选择"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Missing the required permissions: ${missingPermissions.join( ', ' )}": [
        ""
      ],
      "Monthly": [
        "每月"
      ],
      "Must select a bookmark or enter a search query": [
        "必须选择一个书签或输入一个搜索查询"
      ],
      "N/A": [
        "不适用"
      ],
      "Name": [
        "名称"
      ],
      "Never": [
        "决不"
      ],
      "New Job Template": [
        "新作业模板"
      ],
      "New UI": [
        ""
      ],
      "Next": [
        ""
      ],
      "No (override)": [
        "否（覆盖）"
      ],
      "No Target Hosts": [
        "没有目标主机"
      ],
      "No hosts found.": [
        "找不到主机。"
      ],
      "No jobs available": [
        "没有可用的作业"
      ],
      "No results found": [
        "没有找到结果"
      ],
      "No template mapped to feature %{feature_name}": [
        "没有映射到功能 %{feature_name} 的模板"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "並不是所有需要的輸入都有值。缺少的输入：%s"
      ],
      "Not available": [
        ""
      ],
      "Not yet": [
        ""
      ],
      "Now": [
        ""
      ],
      "On": [
        "上"
      ],
      "Only one of feature or job_template_id can be specified": [
        "只能指定一个功能或 job_template_id"
      ],
      "Opening job invocation form": [
        ""
      ],
      "Organization": [
        "机构"
      ],
      "Override the description format from the template for this invocation only": [
        "只为此调用覆盖来自模板的描述格式"
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Override the timeout interval from the template for this invocation only": [
        "只为此调用使用该模板覆盖超时间隔"
      ],
      "Overview": [
        "概况"
      ],
      "Overwrite": [
        "覆盖"
      ],
      "Overwrite template if it already exists": [
        "如果已存在则覆盖模版"
      ],
      "Password": [
        "密码"
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "在作业完成之前，密码都会以加密方式存储在数据库中。对于未来或周期性执行，该密码将在最后一次执行后被删除。"
      ],
      "Pending": [
        "待处理"
      ],
      "Perform a single Puppet run": [
        "执行一个单独 Puppet 运行"
      ],
      "Perform no more executions after this time": [
        "在此时间后不再执行"
      ],
      "Permission Denied": [
        ""
      ],
      "Please enter a search query": [
        ""
      ],
      "Please go back to \\\\\\\"Schedule\\\\\\\" - \\\\\\\"Future execution\\\\\\\" step to fix the error": [
        ""
      ],
      "Please refine your search.": [
        "请重新调整您的搜索。"
      ],
      "Please request the required permissions listed below from a Foreman administrator:": [
        ""
      ],
      "Please select at least one host": [
        ""
      ],
      "Please select at least one host collection": [
        ""
      ],
      "Please select at least one host group": [
        ""
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        "要用于 SSH 通信的端口。默认端口 22。您可以通过设置名为 remote_execution_ssh_port 的参数来按主机进行覆盖。"
      ],
      "Prefer IPv6 over IPv4": [
        "首选 IPv6 而不是 IPv4 "
      ],
      "Preview": [
        "预览"
      ],
      "Preview Hosts": [
        "预览主机"
      ],
      "Preview job description": [
        "预览作业描述"
      ],
      "Preview templates": [
        "预览模板"
      ],
      "Private key passphrase": [
        "私钥密码口令"
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        "预览模板有问题：%{error}。请注意，在预览前需要保存模板输入的改变。"
      ],
      "Proceed Anyway": [
        ""
      ],
      "Provider type": [
        "供应商类型"
      ],
      "Providers and templates": [
        "供应商和模板"
      ],
      "Proxies": [
        "代理服务器"
      ],
      "Purpose": [
        "目的"
      ],
      "Query type": [
        "查询类型"
      ],
      "REX job has failed - %s": [
        "REX 作业已失败 - %s"
      ],
      "REX job has finished - %s": [
        "REX 作业已完成 - %s"
      ],
      "REX job has succeeded - %s": [
        "REX 作业已成功 - %s"
      ],
      "REX pull mode": [
        ""
      ],
      "Randomized": [
        "随机化"
      ],
      "Recent jobs": [
        "最近的作业"
      ],
      "Recurrence": [
        "重复发生"
      ],
      "Recurring execution": [
        ""
      ],
      "Recurring logic": [
        "重复逻辑"
      ],
      "Recurring logic %s cancelled successfully.": [
        ""
      ],
      "Recurring logic %s disabled successfully.": [
        ""
      ],
      "Recurring logic %s enabled successfully.": [
        ""
      ],
      "Recursive rendering of templates detected": [
        "检测到递归的模板呈现"
      ],
      "Refresh": [
        "刷新"
      ],
      "Remote Execution": [
        "远程执行"
      ],
      "Remote Execution Features": [
        "远程执行功能"
      ],
      "Remote Execution Interface": [
        "远程执行接口"
      ],
      "Remote action:": [
        "远程操作："
      ],
      "Remote execution": [
        "远程执行"
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        "应触发的远程执行功能标签，将使用分配给此功能的任务模板"
      ],
      "Remote execution job": [
        "远程执行作业"
      ],
      "Repeat a maximum of N times": [
        "最多重复 N 次"
      ],
      "Repeat amount can only be a positive number": [
        "重复数量只能是一个正数"
      ],
      "Repeats": [
        "重复"
      ],
      "Rerun": [
        "重新运行"
      ],
      "Rerun all": [
        ""
      ],
      "Rerun failed": [
        "重新运行失败"
      ],
      "Rerun job on failed hosts": [
        "在失败的主机上重新运行作业"
      ],
      "Rerun on %s": [
        "在 %s 重新运行"
      ],
      "Rerun on failed hosts": [
        "在失败的主机上重新运行"
      ],
      "Rerun successful": [
        ""
      ],
      "Rerun the job": [
        "重新运行作业"
      ],
      "Reset to default": [
        "重置为默认"
      ],
      "Resolves to": [
        "解析到"
      ],
      "Results": [
        "结果"
      ],
      "Review details": [
        "审阅详情"
      ],
      "Run": [
        "运行"
      ],
      "Run Job": [
        "运行作业"
      ],
      "Run Puppet Once": [
        "运行 Puppet 一次"
      ],
      "Run Script": [
        ""
      ],
      "Run a script": [
        ""
      ],
      "Run at most N tasks at a time": [
        "一次最多运行 N 个任务"
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        "一次最多运行 N 个任务。如果设置了此选项并启用了代理批处理触发，则将在智能代理上以大小为 1 的批处理触发任务。"
      ],
      "Run job": [
        "运行作业"
      ],
      "Run on selected hosts": [
        ""
      ],
      "Running": [
        "執行中"
      ],
      "SSH Port": [
        "SSH 端口"
      ],
      "SSH User": [
        "SSH 用户"
      ],
      "SSH provider specific options": [
        "SSH 供应商特定的选项"
      ],
      "SSH user": [
        ""
      ],
      "SSH user:": [
        ""
      ],
      "Schedule": [
        "调度"
      ],
      "Schedule Remote Job": [
        "调度远程作业"
      ],
      "Schedule a job": [
        "调度一个作业"
      ],
      "Schedule the job for a future time": [
        "把作业调度到一个以后的时间"
      ],
      "Schedule the job to start at a later time": [
        "把作业调度在一个以后的时间开始"
      ],
      "Schedule type": [
        "调度类型"
      ],
      "Scheduled": [
        "调度的"
      ],
      "Scheduled at:": [
        ""
      ],
      "Scheduled to start at": [
        "调度开始于"
      ],
      "Scheduled to start before": [
        "调度在这个时间前开始"
      ],
      "Scheduled: ${totalHosts} hosts": [
        ""
      ],
      "Script": [
        "脚本"
      ],
      "Scroll to bottom": [
        "滚动到底部"
      ],
      "Scroll to top": [
        "滚动到顶部"
      ],
      "Search Query": [
        "搜索查询"
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        "在分配给主机的代理之外搜索远程执行代理。搜索将会限制在主机的机构和位置内。"
      ],
      "Search query": [
        "搜索查询"
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        "在主机上搜索具有远程执行功能的任何代理，当主机没有子网或子网没有执行代理时，此命令很有用"
      ],
      "See more details at %s": [
        "在 %s 参阅更多细节"
      ],
      "See the last task details": [
        "查看最后的任务详情"
      ],
      "See the task details": [
        "查看任务详情"
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        "选择用于生成特定远程执行作业的报告模板"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "选择要上传的 ERB 文件来导入任务模版。这个模版必须包含第一个 ERB 注释里的元数据。"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "选择适用于该子网的尽可能多的远程执行代理。当添加具有相同提供者的多个代理时，将在它们之间平衡操作。"
      ],
      "Select the type of execution": [
        ""
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "Set SSH key passphrase": [
        "设置 SSH 密钥口令"
      ],
      "Set SSH password": [
        "设置 SSH 密码"
      ],
      "Set SSH user": [
        ""
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        "为有效用户设置密码（使用类似 sudo 的机制）"
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        "相比 fqdn，是否应优先使用主机接口上的 ip 地址？当 DNS 未能成功解析 fqdns 时，它很有用。您可以通过设置参数 remote_execution_connect_by_ip 来覆盖每个主机的这个地址。对于多堆栈的主机，您应该考虑 remote_execution_connect_by_ip_prefer_ipv6 设置"
      ],
      "Should this interface be used for remote execution?": [
        "该接口应该用于远程执行吗？"
      ],
      "Show Job status for the hosts": [
        "显示主机的作业状态"
      ],
      "Show all advanced fields": [
        "现实所有高级字段"
      ],
      "Show foreign input set details": [
        "显示外部输入集详细信息"
      ],
      "Show job invocation": [
        "显示作业调用"
      ],
      "Show job template details": [
        "显示作业模板详情"
      ],
      "Show remote execution feature": [
        "显示远程执行功能"
      ],
      "Skip to review": [
        ""
      ],
      "Skip to review step": [
        ""
      ],
      "Snippet": [
        "程序代码片段"
      ],
      "Start": [
        "开始"
      ],
      "Start job": [
        ""
      ],
      "Started": [
        "已启动"
      ],
      "Started at:": [
        ""
      ],
      "Starts": [
        "开始"
      ],
      "Starts Before": [
        ""
      ],
      "Starts at": [
        "开始于"
      ],
      "Starts before": [
        "开始前"
      ],
      "State": [
        "状态"
      ],
      "Static Query": [
        "静态查询"
      ],
      "Static query": [
        "静态查询"
      ],
      "Status": [
        "状态"
      ],
      "Submit": [
        ""
      ],
      "Subscribe to all my jobs": [
        "订阅到所有主机"
      ],
      "Subscribe to my failed jobs": [
        "订阅到我失败的作业"
      ],
      "Subscribe to my succeeded jobs": [
        "订阅到我成功的作业"
      ],
      "Succeeded": [
        "已成功"
      ],
      "Succeeded:": [
        ""
      ],
      "Success": [
        "成功"
      ],
      "Switch to the new job invocation detail UI": [
        ""
      ],
      "Sync Job Templates": [
        "同步作业模板"
      ],
      "System status": [
        ""
      ],
      "Systems": [
        ""
      ],
      "Target hosts": [
        "目标主机"
      ],
      "Target hosts and inputs": [
        "目标主机和输入"
      ],
      "Target template ID": [
        "目标模板 ID"
      ],
      "Target: ": [
        "目标："
      ],
      "Task Details": [
        "任务详情"
      ],
      "Task cancelled": [
        "任务被取消"
      ],
      "Template ERB": [
        "模版 ERB"
      ],
      "Template Invocation for %s": [
        "%s 的模板调用"
      ],
      "Template failed with:": [
        "模板失败并带有："
      ],
      "Template name": [
        "模板名称"
      ],
      "Template version": [
        "模板版本"
      ],
      "Template with id '%{id}' was not found": [
        "找不到 id 为 '%{id}' 的模板"
      ],
      "Template:": [
        ""
      ],
      "Templates list failed with:": [
        "模板列表失败并带有："
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "动态查询 '%{query}' 还没有解析。现在应该解析的主机列表可在 %{here} 查看。"
      ],
      "The execution interface is used for remote execution": [
        "用于远程执行的执行接口"
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "由于所选查询是动态的，因此最终主机列表可能会更改。将在执行期间重新运行。"
      ],
      "The job cannot be aborted at the moment.": [
        "目前无法终止作业。"
      ],
      "The job cannot be cancelled at the moment.": [
        "目前无法取消作业。"
      ],
      "The job could not be cancelled.": [
        "此作业无法取消。"
      ],
      "The job template to use, parameter is required unless feature was specified": [
        "要使用的任务模板，除非已指定功能，否则参数是必需的"
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "唯一可用的代理 %{proxy_names} 已停机"
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "用户无法访问映射到功能 %{feature_name} 的模板 %{template_name}"
      ],
      "There are no available input fields for the selected template.": [
        "所选模板没有可用的输入字段。"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "更新状态时出错，请尝试刷新页面。"
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        "如果在作业开始后将主机删除或移动到其他机构或位置，则可能会发生这种情况"
      ],
      "This template is locked for editing.": [
        "该模板被锁定进行编辑。"
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "此模板已锁定。请将它克隆到一个新的模板进行定制。"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "这个模块用来生成描述。输入值可以使用语法 %{package}。您可以使用 %{job_category} 和 %{template_name} 来包括作业类型和模板名称。"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        "这个模块用来生成描述。<br/>输入值可以使用语法%{package}。<br/>您可以使用 {job_category} 和 {template_name} 来<br/>包括作业类型和模板名称。"
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        "在远程主机上开始后，以秒计算时间，之后结束作业。"
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Time to pickup": [
        ""
      ],
      "Timeout to kill": [
        "超时至结束"
      ],
      "Timeout to kill after": [
        "超时至终止时间"
      ],
      "Toggle DEBUG": [
        "切换 DEBUG"
      ],
      "Toggle STDERR": [
        "切换 STDERR"
      ],
      "Toggle STDOUT": [
        "切换 STDOUT"
      ],
      "Toggle command": [
        "切换命令"
      ],
      "Total hosts": [
        "主机总数"
      ],
      "Try to abort the job on a host without waiting for its result": [
        "尝试在不等待结果的情况下终止主机中的作业"
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        "尝试在不等待远程主机的结果情况下终止作业"
      ],
      "Try to cancel the job": [
        "尝试取消作业"
      ],
      "Try to cancel the job on a host": [
        "尝试取消主机上的作业"
      ],
      "Trying to abort the job": [
        "尝试中止作业"
      ],
      "Trying to abort the job %s.": [
        ""
      ],
      "Trying to cancel the job": [
        "尝试取消作业"
      ],
      "Trying to cancel the job %s.": [
        ""
      ],
      "Type": [
        "类型"
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        "类型会影响到什么时候会评估到主机。"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "Type of execution": [
        ""
      ],
      "Type of query": [
        "查询类型"
      ],
      "Unable to create mail notification: %s": [
        "无法创建邮件通知：%s"
      ],
      "Unable to fetch public key": [
        "无法获取公共密钥"
      ],
      "Unable to remove host from known hosts": [
        "无法从已知主机中删除主机"
      ],
      "Unable to save template. Correct highlighted errors": [
        "无法保存模版。纠正高亮显示的错误。"
      ],
      "Unknown execution status": [
        "未知的执行状态"
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "未知输入％{input_name}模板用于模板％{template_name}"
      ],
      "Unknown remote execution feature %s": [
        "未知的远程执行功能 %s"
      ],
      "Unsupported or no operating system found for this host.": [
        "该主机不支持或找不到操作系统。"
      ],
      "Update a foreign input set": [
        "更新外部输入集"
      ],
      "Update a job template": [
        "更新作业模板"
      ],
      "Use default description template": [
        "使用默认描述模板"
      ],
      "Use legacy form": [
        ""
      ],
      "Use new job wizard": [
        ""
      ],
      "User Inputs": [
        "用户输入"
      ],
      "User can not execute job on host %s": [
        "用户不能在主机 %s 上执行作业"
      ],
      "User can not execute job on infrastructure host %s": [
        "用户无法在基础架构主机 %s 上执行作业"
      ],
      "User can not execute this job template": [
        "用户无法执行这个作业模板"
      ],
      "User can not execute this job template on %s": [
        "用户不能在 %s 上执行这个作业模板"
      ],
      "User input": [
        "用户输入"
      ],
      "Value": [
        "值"
      ],
      "View all jobs": [
        "查看所有作业"
      ],
      "View finished jobs": [
        "查看完成的作业"
      ],
      "View running jobs": [
        "查看运行的作业"
      ],
      "View scheduled jobs": [
        "查看调度的作业"
      ],
      "View task": [
        ""
      ],
      "Web Console": [
        "Web 控制台"
      ],
      "Weekly": [
        "每周"
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "应该使用什么命令切换到有效用户。%s 之一"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "应该使用什么用户来运行脚本（使用类似于 sudo 的机制）"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "应该使用什么用户来运行脚本（使用类似于 sudo 的机制）。默认为模板参数或全局设置。"
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        "使用 ip 地址进行连接时，是否应该首选 IPv6 地址？如果没有设置 IPv6 地址，它会自动回退到使用 IPv4。您可以通过设置名为remote_execution_connect_by_ip_prefer_prefer_ipv6 的参数来针对单个主机进行覆盖。默认情况下，为了实现兼容的目的，IPv4 将优先于 IPv6。"
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        "如果启用，工作目录会在任务完成后被删除。使用名为 remote_execution_cleanup_working_dirs 的参数可以在相关主机上覆盖这个设置。"
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        "在哪里可以找到 Web Console 按钮的 Cockpit 实例。默认情况下，不显示任何按钮。"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "是否应允许从调用表单中覆盖有效用户。"
      ],
      "Whether or not the template is locked for editing": [
        "此模板是否被锁定用于编辑"
      ],
      "Whether the current user login should be used as the effective user": [
        "当前用户登录名是否应用作有效用户"
      ],
      "Whether to overwrite the template if it already exists": [
        "如果已存在是否覆盖模版"
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "运行 db:seed 时是否应该从磁盘同步模板。"
      ],
      "Workers pool size": [
        "工作节点池的大小"
      ],
      "Yes (override)": [
        "是（覆盖）"
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "您没有权限查看当前分配的模板。现在保存表单将取消分配模板。"
      ],
      "You are not authorized to perform this action.": [
        ""
      ],
      "You have %s results to display. Showing first %s results": [
        "您有 %s 个结果现实。显示前 %s 个结果"
      ],
      "add an input set for this template to reference a different template inputs": [
        "为此模板添加一个输入集，以引用其他模板输入"
      ],
      "cancelled": [
        "已取消"
      ],
      "default_capsule method missing from SmartProxy": [
        "SmartProxy 中缺少 default_capsule 方法"
      ],
      "documentation": [
        ""
      ],
      "effective user": [
        "有效用户"
      ],
      "error": [
        "错误"
      ],
      "error during rendering: %s": [
        "呈现时出错：%s"
      ],
      "evaluates just after you submit this form": [
        "提交此表单后评估"
      ],
      "evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it": [
        ""
      ],
      "failed": [
        "失败"
      ],
      "here": [
        "这里"
      ],
      "host already has an execution interface": [
        "主机已有一个执行接口"
      ],
      "hosts": [
        "主机"
      ],
      "in %s": [
        "在 %s"
      ],
      "included template '%s' not found": [
        "没有找到包括的模板 '%s'"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "使用名称为 '%s' 的输入宏，当没有为这个模板定义使用这个名称的输入"
      ],
      "is day of month (range: 1-31)": [
        "日期（范围：1-31）"
      ],
      "is day of week (range: 0-6)": [
        "星期几（范围：0-6）"
      ],
      "is hour (range: 0-23)": [
        "小时（范围：0-23）"
      ],
      "is minute (range: 0-59)": [
        "分钟（范围：0-59）"
      ],
      "is month (range: 1-12)": [
        "月份（范围：1-12）"
      ],
      "no": [
        "否"
      ],
      "occurences": [
        ""
      ],
      "open-help-tooltip-button": [
        "open-help-tooltip-button"
      ],
      "queued": [
        "已排队"
      ],
      "queued to start executing in %{time}": [
        "已排队，在 %{time} 开始实施"
      ],
      "range: 0-59": [
        ""
      ],
      "remove template input set": [
        "删除模板输入集"
      ],
      "running %{percent}%%": [
        "运行 %{percent}%%"
      ],
      "seconds": [
        "秒"
      ],
      "succeeded": [
        "已成功"
      ],
      "tasks at a time": [
        "在一个时间点的任务"
      ],
      "template": [
        "模板"
      ],
      "unknown status": [
        "未知的状态"
      ],
      "using ": [
        "使用 "
      ],
      "using Smart Proxy": [
        "使用智能代理"
      ],
      "view host names": [
        ""
      ],
      "yes": [
        "是"
      ]
    }
  }
};