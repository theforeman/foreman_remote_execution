 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['ru'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 15.0.0",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "Yulia <yulia.poyarkova@redhat.com>, 2016",
        "Language-Team": "Russian (http://app.transifex.com/foreman/foreman/language/ru/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ru",
        "Plural-Forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);",
        "lang": "ru",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);"
      },
      "${d.title} ${d.count} hosts": [
        ""
      ],
      "%s": [
        "%s"
      ],
      "%s ago": [
        "%s назад"
      ],
      "%s job has been invoked": [
        ""
      ],
      "%s more": [
        ""
      ],
      "%{description} on %{host}": [
        "%{description} на %{host}"
      ],
      "'Starts at' date must be in the future": [
        ""
      ],
      "'Starts before' date must be after 'Starts at' date": [
        ""
      ],
      "'Starts before' date must be in the future": [
        ""
      ],
      "...and %s more": [
        ""
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "Список входных параметров, которые должны быть исключены при импорте другого шаблона."
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "Список входных параметров, которые должны быть включены при импорте другого шаблона."
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        ""
      ],
      "A job '%{subject}' has failed": [
        ""
      ],
      "A job '%{subject}' has finished successfully": [
        ""
      ],
      "A notification when a job finishes": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "Дополнительный модуль Foreman для удаленного выполнения заданий, объединяющий функции управления конфигурацией и удаленного контроля."
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        ""
      ],
      "A task for this host has not been started": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "Пользователь, от имени которого должен запускаться сценарий. Если отличается от пользователя SSH, для делегирования прав используется su или sudo."
      ],
      "Abort": [
        ""
      ],
      "Abort Job": [
        ""
      ],
      "Abort task": [
        ""
      ],
      "Access denied": [
        "Доступ запрещен"
      ],
      "Action": [
        ""
      ],
      "Actions": [
        "Действия"
      ],
      "Active Filters:": [
        ""
      ],
      "Add Foreign Input Set": [
        "Добавить шаблон"
      ],
      "Advanced fields": [
        ""
      ],
      "After": [
        ""
      ],
      "After %s occurences": [
        ""
      ],
      "All fields are required.": [
        ""
      ],
      "All statuses": [
        ""
      ],
      "Alphabetical": [
        ""
      ],
      "An error occurred while fetching the template invocation details.": [
        ""
      ],
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "Для удаленного выполнения уже выбран другой интерфейс. Вы действительно хотите его заменить?"
      ],
      "Any Location": [
        "Любое местонахождение"
      ],
      "Any Organization": [
        "Любая организация"
      ],
      "Any location": [
        ""
      ],
      "Any organization": [
        ""
      ],
      "Apply to": [
        ""
      ],
      "Are you sure you want to open all invocations in new tabs?": [
        ""
      ],
      "At": [
        "в"
      ],
      "At minute": [
        ""
      ],
      "Awaiting start": [
        ""
      ],
      "Back": [
        "Назад"
      ],
      "Back to Job": [
        "Назад к заданию"
      ],
      "Bookmark": [
        "Закладка"
      ],
      "Can't find Job Invocation for an id %s": [
        ""
      ],
      "Cancel": [
        ""
      ],
      "Cancel Job": [
        "Отменить"
      ],
      "Cancel Task": [
        ""
      ],
      "Cancel job invocation": [
        ""
      ],
      "Cancel recurring": [
        ""
      ],
      "Cancelled": [
        "Отменено"
      ],
      "Cancelled:": [
        ""
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "Невозможно сформировать список узлов, не выбрав закладку или не указав запрос поиска"
      ],
      "Cannot resolve hosts without a user": [
        "Невозможно сформировать список узлов, не выбрав пользователя."
      ],
      "Cannot specify both bookmark_id and search_query": [
        "bookmark_id и search_query не могут использоваться одновременно."
      ],
      "Categories list failed with:": [
        ""
      ],
      "Category and template": [
        ""
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        ""
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "При добавлении входных параметров из «%{template}» в «%{target_template}» была обнаружена циклическая зависимость. Стек: %{templates_stack}"
      ],
      "Cleanup working directories": [
        ""
      ],
      "Clear all filters": [
        ""
      ],
      "Clear input": [
        ""
      ],
      "Clone a provision template": [
        "Клонировать шаблон подготовки"
      ],
      "Close": [
        "Закрыть"
      ],
      "Cockpit URL": [
        ""
      ],
      "Command": [
        ""
      ],
      "Concurrency level": [
        "Параллелизм"
      ],
      "Concurrency level limited to": [
        ""
      ],
      "Connect by IP": [
        ""
      ],
      "Control concurrency level and distribution over time": [
        "Контроль параллельного выполнения и распределения во времени"
      ],
      "Copy to clipboard": [
        ""
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
        ""
      ],
      "Could not enable recurring logic %s: ${response}": [
        ""
      ],
      "Could not find any suitable interface for execution": [
        ""
      ],
      "Could not render the preview because no host matches the search query.": [
        ""
      ],
      "Could not rerun job %{id} because its template could not be found": [
        ""
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        ""
      ],
      "Could not use any template used in the job invocation": [
        "Не удалось применить ни один из шаблонов, настроенных для этого вызова задания"
      ],
      "Create": [
        "Создать"
      ],
      "Create Report": [
        ""
      ],
      "Create a foreign input set": [
        "Создать набор входных параметров"
      ],
      "Create a job invocation": [
        "Создать вызов задания"
      ],
      "Create a job template": [
        "Создать шаблон задания"
      ],
      "Create a recurring job": [
        "Периодическое выполнение"
      ],
      "Create job": [
        ""
      ],
      "Create report": [
        ""
      ],
      "Create report for this job": [
        ""
      ],
      "Cron line": [
        "Строка Cron"
      ],
      "Cron line (extended)": [
        ""
      ],
      "Cron line format '1 2 3 4 5', where:": [
        ""
      ],
      "Cronline": [
        ""
      ],
      "Current iteration": [
        ""
      ],
      "Current location %s is different from job's location %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        ""
      ],
      "Current organization %s is different from job's organization %s. This job may run on different hosts than before.": [
        ""
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        ""
      ],
      "DEBUG": [
        ""
      ],
      "Daily": [
        "Ежедневный"
      ],
      "Date must be in the future": [
        ""
      ],
      "Days": [
        "Дни"
      ],
      "Days of week": [
        "Дни недели"
      ],
      "Default SSH key passphrase": [
        ""
      ],
      "Default SSH password": [
        ""
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        ""
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        ""
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        "Пользователь по умолчанию для SSH. Для того чтобы переопределить это значение для отдельных узлов, используйте параметр remote_execution_ssh_user."
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "Пользователь, от имени которого по умолчанию будет запускаться сценарий. Если отличается от пользователя SSH, для делегирования прав будет использоваться su или sudo."
      ],
      "Delete a foreign input set": [
        "Удалить набор входных параметров"
      ],
      "Delete a job template": [
        "Удалить шаблон задания"
      ],
      "Description": [
        "Описание"
      ],
      "Description Template": [
        ""
      ],
      "Description template": [
        "Шаблон описания"
      ],
      "Designation of a special purpose": [
        ""
      ],
      "Disable recurring": [
        ""
      ],
      "Display advanced fields": [
        "Показать дополнительные параметры"
      ],
      "Does not repeat": [
        ""
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "Обнаружены дубликаты входных данных: %{duplicated_inputs}"
      ],
      "Dynamic Query": [
        "Динамический"
      ],
      "Dynamic query": [
        ""
      ],
      "Edit %s": [
        "Изменить %s"
      ],
      "Edit Job Template": [
        "Изменить шаблон задания"
      ],
      "Edit Remote Execution Feature": [
        "Изменение функции удаленного выполнения"
      ],
      "Edit job description template": [
        ""
      ],
      "Effective User": [
        ""
      ],
      "Effective User Method": [
        ""
      ],
      "Effective user": [
        "Действующий пользователь"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "Метод действующего пользователя, «%{current_value}», не является одним из допустимых вариантов: %{valid_methods}"
      ],
      "Effective user options": [
        "Параметры действующего пользователя"
      ],
      "Effective user password": [
        ""
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Effective user:": [
        ""
      ],
      "Enable Global Proxy": [
        ""
      ],
      "Enable recurring": [
        ""
      ],
      "End time needs to be after start time": [
        ""
      ],
      "Ends": [
        "Заканчивается"
      ],
      "Error loading data from proxy": [
        "Не удалось загрузить данные с прокси"
      ],
      "Errors:": [
        ""
      ],
      "Evaluated at:": [
        "Обработано:"
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
        ""
      ],
      "Execution": [
        "Выполнение"
      ],
      "Execution order": [
        ""
      ],
      "Execution ordering": [
        ""
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        ""
      ],
      "Exit status: %s": [
        "Код завершения: %s"
      ],
      "Export a job template to ERB": [
        "Экспорт шаблона в ERB"
      ],
      "Failed": [
        "Не удалась"
      ],
      "Failed hosts": [
        ""
      ],
      "Failed rendering template: %s": [
        "Не удалось обработать шаблон: %s"
      ],
      "Failed:": [
        ""
      ],
      "Fallback to Any Proxy": [
        ""
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "Входной параметр %{input_name}, заданный функцией, не определен в шаблоне %{template_name}."
      ],
      "Fill all required fields in all the steps": [
        ""
      ],
      "Fill all required fields in all the steps to start the job": [
        ""
      ],
      "Filter by host collections": [
        ""
      ],
      "Filter by host groups": [
        ""
      ],
      "Filter by hosts": [
        ""
      ],
      "Finished": [
        "Готово"
      ],
      "For Future execution a 'Starts at' date or 'Starts before' date must be selected. Immediate execution can be selected in the previous step.": [
        ""
      ],
      "For example: 1, 2, 3, 4, 5...": [
        ""
      ],
      "Foreign input set": [
        "Импорт входных данных"
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        ""
      ],
      "Form Job Template": [
        ""
      ],
      "Future execution": [
        ""
      ],
      "Get output for a host": [
        "Получить данные вывода узла"
      ],
      "Get outputs of hosts in a job": [
        ""
      ],
      "Get raw output for a host": [
        ""
      ],
      "Has to be a positive number": [
        ""
      ],
      "Hide advanced fields": [
        "Скрыть дополнительные параметры"
      ],
      "Hide all advanced fields": [
        ""
      ],
      "Host": [
        "Хост"
      ],
      "Host collections": [
        ""
      ],
      "Host detail": [
        "Свойства узла"
      ],
      "Host group": [
        ""
      ],
      "Host groups": [
        "Группы узлов"
      ],
      "Host task": [
        ""
      ],
      "Host with id '%{id}' was not found": [
        "Узел «%{id}» не найден."
      ],
      "Hosts": [
        "Узлы"
      ],
      "Hosts gone missing": [
        ""
      ],
      "Hourly": [
        ""
      ],
      "How often the job should occur, in the cron format": [
        "Частота выполнения задания, в формате cron"
      ],
      "ID": [
        ""
      ],
      "Identifier of the Host interface for Remote execution": [
        ""
      ],
      "Immediate execution": [
        ""
      ],
      "Import": [
        "Импорт"
      ],
      "Import a job template from ERB": [
        "Импорт шаблона из ERB"
      ],
      "In Progress": [
        ""
      ],
      "In Progress:": [
        ""
      ],
      "Include all inputs from the foreign template": [
        "Добавить все входные параметры из внешнего шаблона"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "Обозначает, что действие следует отменить, если оно не будет запущено до указанного времени."
      ],
      "Inherit from host parameter": [
        ""
      ],
      "Input": [
        "Параметр"
      ],
      "Input set description": [
        "Описание набора входных параметров"
      ],
      "Inputs to use": [
        "Входящие параметры"
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        ""
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        ""
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Invalid date": [
        ""
      ],
      "Invalid time format": [
        ""
      ],
      "Invocation type, one of %s": [
        "Тип вызова. Возможные значения: %s"
      ],
      "Iteration limit": [
        ""
      ],
      "Job": [
        "Задание"
      ],
      "Job Details": [
        ""
      ],
      "Job Invocation": [
        "Вызов задания"
      ],
      "Job Invocation Report Template": [
        ""
      ],
      "Job Invocations": [
        ""
      ],
      "Job Task": [
        "Задача"
      ],
      "Job Templates": [
        "Шаблоны заданий"
      ],
      "Job cancelled by user": [
        ""
      ],
      "Job category": [
        "Категория"
      ],
      "Job execution failed": [
        ""
      ],
      "Job finished with error": [
        "Задание было завершено с ошибкой"
      ],
      "Job invocation": [
        "Вызов задания"
      ],
      "Job invocations": [
        "Вызовы заданий"
      ],
      "Job invocations detail": [
        ""
      ],
      "Job result": [
        ""
      ],
      "Job template": [
        "Шаблон задания"
      ],
      "Job template ID to be used for the feature": [
        "Идентификатор шаблона задания для этой функции"
      ],
      "Job template imported successfully.": [
        "Импорт шаблона завершен успешно."
      ],
      "Job templates": [
        "Шаблоны заданий"
      ],
      "Job with id '%{id}' was not found": [
        ""
      ],
      "JobTemplate|Locked": [
        "Заблокирован"
      ],
      "JobTemplate|Name": [
        "Имя"
      ],
      "JobTemplate|Snippet": [
        "Фрагмент"
      ],
      "Jobs": [
        "Задания"
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Label": [
        "Метка"
      ],
      "Last execution cancelled": [
        ""
      ],
      "Last execution failed": [
        "Ошибка выполнения"
      ],
      "Last execution succeeded": [
        "Выполнено успешно"
      ],
      "Last occurrence": [
        ""
      ],
      "Latest Jobs": [
        ""
      ],
      "Learn more about this in the documentation.": [
        "Обратиться к документации"
      ],
      "Legacy UI": [
        ""
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List foreign input sets": [
        "Показать внешние наборы входных параметров"
      ],
      "List hosts belonging to job invocation": [
        ""
      ],
      "List job invocations": [
        "Список вызовов заданий"
      ],
      "List job templates": [
        "Список шаблонов заданий"
      ],
      "List job templates per location": [
        "Список шаблонов заданий по местоположению"
      ],
      "List job templates per organization": [
        "Список шаблонов заданий по организациям"
      ],
      "List of proxy IDs to be used for remote execution": [
        ""
      ],
      "List remote execution features": [
        "Список функций удаленного выполнения"
      ],
      "List template invocations belonging to job invocation": [
        ""
      ],
      "Location": [
        "Местоположение"
      ],
      "Manual selection": [
        "Ручной выбор"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Missing the required permissions: ${missingPermissions.join( ', ' )}": [
        ""
      ],
      "Monthly": [
        "Ежемесячный"
      ],
      "Must select a bookmark or enter a search query": [
        "Выберите закладку или введите запрос поиска"
      ],
      "N/A": [
        "Недоступно"
      ],
      "Name": [
        "Название"
      ],
      "Never": [
        "Никогда"
      ],
      "New Job Template": [
        "Создать шаблон задания"
      ],
      "New UI": [
        ""
      ],
      "Next": [
        "Далее"
      ],
      "Next occurrence": [
        ""
      ],
      "No (override)": [
        ""
      ],
      "No Results": [
        ""
      ],
      "No Target Hosts": [
        ""
      ],
      "No hosts found": [
        ""
      ],
      "No hosts found.": [
        "Нет узлов."
      ],
      "No jobs available": [
        ""
      ],
      "No output for the selected filters": [
        ""
      ],
      "No results found": [
        ""
      ],
      "No template mapped to feature %{feature_name}": [
        "С %{feature_name} не связан ни один шаблон."
      ],
      "No user input": [
        ""
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "Отсутствуют значения некоторых обязательных входных данных: %s"
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
      "OS": [
        ""
      ],
      "On": [
        "Настроить"
      ],
      "Only one of feature or job_template_id can be specified": [
        ""
      ],
      "Open all in new tabs": [
        ""
      ],
      "Open all invocations in new tabs": [
        ""
      ],
      "Open in new tab": [
        ""
      ],
      "Opening job invocation form": [
        ""
      ],
      "Organization": [
        "Организация"
      ],
      "Override the description format from the template for this invocation only": [
        "Переопределить формат описания из шаблона только на время этого вызова"
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Override the timeout interval from the template for this invocation only": [
        ""
      ],
      "Overview": [
        "Обзор"
      ],
      "Overwrite": [
        "Перезаписать"
      ],
      "Overwrite template if it already exists": [
        "Перезаписать, если шаблон уже существует"
      ],
      "Password": [
        "Пароль"
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        ""
      ],
      "Pending": [
        "Ожидание"
      ],
      "Perform a single Puppet run": [
        ""
      ],
      "Perform no more executions after this time": [
        "Остановить после указанного числа повторений"
      ],
      "Permission Denied": [
        ""
      ],
      "Please enter a search query": [
        ""
      ],
      "Please go back to \\\\\\\"Schedule\\\\\\\" - \\\\\\\"Future execution\\\\\\\" or \\\\\\\"Recurring execution\\\\\\\" step to fix the error": [
        ""
      ],
      "Please go back to \\\\\\\"Schedule\\\\\\\" - \\\\\\\"Future execution\\\\\\\" step to fix the error": [
        ""
      ],
      "Please make sure that the Smart Proxy is configured correctly for the Pull provider.": [
        ""
      ],
      "Please refine your search.": [
        ""
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
      "Popups are blocked by your browser. Please allow popups for this site to open all invocations in new tabs.": [
        ""
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        ""
      ],
      "Prefer IPv6 over IPv4": [
        ""
      ],
      "Preview": [
        "Просмотр"
      ],
      "Preview Hosts": [
        ""
      ],
      "Preview Template": [
        ""
      ],
      "Preview job description": [
        ""
      ],
      "Preview templates": [
        ""
      ],
      "Private key passphrase": [
        ""
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        "Не удалось открыть шаблон для предварительного просмотра: %{error}. Прежде чем повторить попытку, сохраните изменения входных параметров."
      ],
      "Proceed Anyway": [
        ""
      ],
      "Provider type": [
        "Тип провайдера"
      ],
      "Providers and templates": [
        "Сервисы и шаблоны"
      ],
      "Proxies": [
        "Прокси"
      ],
      "Purpose": [
        ""
      ],
      "Query type": [
        ""
      ],
      "REX job has failed - %s": [
        ""
      ],
      "REX job has finished - %s": [
        ""
      ],
      "REX job has succeeded - %s": [
        ""
      ],
      "REX pull mode": [
        ""
      ],
      "Randomized": [
        ""
      ],
      "Recent jobs": [
        ""
      ],
      "Recurrence": [
        ""
      ],
      "Recurring execution": [
        ""
      ],
      "Recurring logic": [
        "Регулярное выполнение"
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
        "Обнаружена рекурсия при обработке шаблонов"
      ],
      "Refresh": [
        "Обновить"
      ],
      "Remote Execution": [
        "Удаленное выполнение"
      ],
      "Remote Execution Features": [
        "Функции удаленного выполнения"
      ],
      "Remote Execution Interface": [
        ""
      ],
      "Remote action:": [
        "Удаленное действие:"
      ],
      "Remote execution": [
        "Удаленное выполнение"
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        ""
      ],
      "Remote execution job": [
        ""
      ],
      "Repeat a maximum of N times": [
        "Количество повторений"
      ],
      "Repeat amount can only be a positive number": [
        ""
      ],
      "Repeat until": [
        ""
      ],
      "Repeats": [
        "Повторяется"
      ],
      "Rerun": [
        "Повторить"
      ],
      "Rerun all": [
        ""
      ],
      "Rerun failed": [
        "Повторить неудавшиеся"
      ],
      "Rerun job on failed hosts": [
        ""
      ],
      "Rerun on %s": [
        "Повторить на %s"
      ],
      "Rerun on failed hosts": [
        "Повторить на узлах с ошибками"
      ],
      "Rerun on succeeded hosts": [
        ""
      ],
      "Rerun succeeded": [
        ""
      ],
      "Rerun successful": [
        ""
      ],
      "Rerun the job": [
        "Повторно выполнить задание"
      ],
      "Reset to default": [
        "Восстановить исходные"
      ],
      "Resolves to": [
        "Применимо к "
      ],
      "Results": [
        ""
      ],
      "Review details": [
        ""
      ],
      "Run": [
        "Выполнить"
      ],
      "Run Job": [
        "Выполнить задание"
      ],
      "Run Puppet Once": [
        ""
      ],
      "Run Script": [
        ""
      ],
      "Run a script": [
        ""
      ],
      "Run at most N tasks at a time": [
        "Максимальное количество параллельно выполняемых задач"
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        ""
      ],
      "Run job": [
        ""
      ],
      "Run on selected hosts": [
        ""
      ],
      "Running": [
        "Работает"
      ],
      "SSH Port": [
        ""
      ],
      "SSH User": [
        ""
      ],
      "SSH provider specific options": [
        "Параметры провайдера SSH"
      ],
      "SSH user": [
        ""
      ],
      "SSH user:": [
        ""
      ],
      "STDERR": [
        ""
      ],
      "STDOUT": [
        ""
      ],
      "Schedule": [
        "Расписание"
      ],
      "Schedule Remote Job": [
        ""
      ],
      "Schedule a job": [
        ""
      ],
      "Schedule the job for a future time": [
        "Настроить время запуска"
      ],
      "Schedule the job to start at a later time": [
        "Отложенный запуск"
      ],
      "Schedule type": [
        ""
      ],
      "Scheduled": [
        ""
      ],
      "Scheduled at:": [
        ""
      ],
      "Scheduled to start at": [
        ""
      ],
      "Scheduled to start before": [
        ""
      ],
      "Scheduled: ${totalHosts} hosts": [
        ""
      ],
      "Script": [
        ""
      ],
      "Scroll to bottom": [
        "Перейти вниз"
      ],
      "Scroll to top": [
        "Перейти наверх"
      ],
      "Search Query": [
        ""
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        ""
      ],
      "Search query": [
        "Поисковый запрос"
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        "Искать любые прокси с возможностью удаленного запуска заданий для этого узла. Используется, если для узла не настроена подсеть или в подсети не настроен прокси-сервер."
      ],
      "See more details at %s": [
        ""
      ],
      "See the last task details": [
        "Показать последнюю выполненную задачу"
      ],
      "See the task details": [
        "Просмотр подробной информации о задаче"
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        ""
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "Выберите файл ERB для импорта шаблона. Первый комментарий ERB в шаблоне должен содержать метаданные."
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "Выберите все возможные прокси для этой подсети. Добавление нескольких прокси позволит равномерно распределять действия между ними."
      ],
      "Select the type of execution": [
        ""
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "Set SSH key passphrase": [
        ""
      ],
      "Set SSH password": [
        ""
      ],
      "Set SSH user": [
        ""
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        ""
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        ""
      ],
      "Should this interface be used for remote execution?": [
        ""
      ],
      "Show Job status for the hosts": [
        ""
      ],
      "Show all advanced fields": [
        ""
      ],
      "Show foreign input set details": [
        "Показать информацию о внешнем наборе входных параметров"
      ],
      "Show job invocation": [
        "Показать вызов задания"
      ],
      "Show job template details": [
        "Показать информацию о шаблоне"
      ],
      "Show remote execution feature": [
        "Показать функцию удаленного выполнения"
      ],
      "Skip to review": [
        ""
      ],
      "Skip to review step": [
        ""
      ],
      "Smart proxy": [
        ""
      ],
      "Snippet": [
        "Фрагмент"
      ],
      "Start": [
        "Начало"
      ],
      "Start job": [
        ""
      ],
      "Started": [
        ""
      ],
      "Started at:": [
        ""
      ],
      "Starts": [
        "Начало"
      ],
      "Starts Before": [
        ""
      ],
      "Starts at": [
        ""
      ],
      "Starts before": [
        ""
      ],
      "State": [
        "Состояние"
      ],
      "Static Query": [
        "Статический"
      ],
      "Static query": [
        ""
      ],
      "Status": [
        "Статус"
      ],
      "Submit": [
        ""
      ],
      "Subscribe to all my jobs": [
        ""
      ],
      "Subscribe to my failed jobs": [
        ""
      ],
      "Subscribe to my succeeded jobs": [
        ""
      ],
      "Succeeded": [
        "Успешно"
      ],
      "Succeeded:": [
        ""
      ],
      "Success": [
        "Успешно"
      ],
      "Successfully copied to clipboard!": [
        ""
      ],
      "Switch to the new job invocation detail UI": [
        ""
      ],
      "Sync Job Templates": [
        ""
      ],
      "System status": [
        ""
      ],
      "Systems": [
        ""
      ],
      "Target Hosts": [
        ""
      ],
      "Target hosts": [
        "Узлы"
      ],
      "Target hosts and inputs": [
        ""
      ],
      "Target template ID": [
        "Идентификатор подключаемого шаблона"
      ],
      "Target:": [
        ""
      ],
      "Target: ": [
        "Узел:"
      ],
      "Task Details": [
        "Описание задачи"
      ],
      "Task cancelled": [
        ""
      ],
      "Task count": [
        ""
      ],
      "Task for the host cancelled succesfully": [
        ""
      ],
      "Template ERB": [
        "ERB"
      ],
      "Template Invocation for %s": [
        ""
      ],
      "Template failed with:": [
        ""
      ],
      "Template invocation not found": [
        ""
      ],
      "Template name": [
        "Имя шаблона"
      ],
      "Template version": [
        "Версия шаблона"
      ],
      "Template with id '%{id}' was not found": [
        "Шаблон «%{id}» не найден."
      ],
      "Template:": [
        ""
      ],
      "Templates list failed with:": [
        ""
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "Динамический запрос «%{query}» еще не был обработан. Список узлов, к которым он будет применен, можно проверить %{here}."
      ],
      "The dynamic query is still being processed. You can {viewTheHosts} targeted by the query.": [
        ""
      ],
      "The execution interface is used for remote execution": [
        "Интерфейс используется для удаленного исполнения заданий"
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "Окончательный список узлов может измениться, так как динамический запрос обрабатывается непосредственно во время запуска задания."
      ],
      "The job cannot be aborted at the moment.": [
        ""
      ],
      "The job cannot be cancelled at the moment.": [
        ""
      ],
      "The job could not be cancelled.": [
        ""
      ],
      "The job template to use, parameter is required unless feature was specified": [
        ""
      ],
      "The number of invocations is:": [
        ""
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "Единственный доступный прокси, %{proxy_names}, выключен",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}"
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "У этого пользователя нет доступа к шаблону %{template_name}, связанному с %{feature_name}"
      ],
      "There are no available input fields for the selected template.": [
        ""
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "Во время обновления статуса произошла ошибка. Попробуйте обновить страницу."
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        ""
      ],
      "This template is locked for editing.": [
        "Шаблон заблокирован."
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "Шаблон заблокирован. Скопируйте его для создания нового шаблона на его основе."
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "Это шаблон для генерации описания. Для того чтобы добавить переменную, используйте синтаксис %{package}; категорию задания — %{job_category}; название шаблона — %{template_name}."
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        ""
      ],
      "This will open a new tab for each invocation.": [
        ""
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        ""
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Time to pickup": [
        ""
      ],
      "Timeout to kill": [
        ""
      ],
      "Timeout to kill after": [
        ""
      ],
      "Toggle DEBUG": [
        "Показать DEBUG"
      ],
      "Toggle STDERR": [
        "Показать STDERR"
      ],
      "Toggle STDOUT": [
        "Показать STDOUT"
      ],
      "Toggle command": [
        "Показать команды"
      ],
      "Total hosts": [
        "Всего узлов"
      ],
      "Try to abort the job on a host without waiting for its result": [
        ""
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        ""
      ],
      "Try to cancel the job": [
        "Попытаться отменить задание"
      ],
      "Try to cancel the job on a host": [
        "Попытаться отменить задание на узле"
      ],
      "Trying to abort the job": [
        ""
      ],
      "Trying to abort the job %s.": [
        ""
      ],
      "Trying to abort the task for the host": [
        ""
      ],
      "Trying to cancel the job": [
        ""
      ],
      "Trying to cancel the job %s.": [
        ""
      ],
      "Trying to cancel the task for the host": [
        ""
      ],
      "Type": [
        "Тип"
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        ""
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "Type of execution": [
        ""
      ],
      "Type of query": [
        "Тип запроса"
      ],
      "Unable to create mail notification: %s": [
        ""
      ],
      "Unable to fetch public key": [
        "Не удалось получить открытый ключ"
      ],
      "Unable to remove host from known hosts": [
        ""
      ],
      "Unable to run job": [
        ""
      ],
      "Unable to save template. Correct highlighted errors": [
        "Не удалось сохранить шаблон. Исправьте выделенные ошибки."
      ],
      "Unknown": [
        ""
      ],
      "Unknown execution status": [
        "Статус выполнения неизвестен"
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "Неизвестный ввод данных из шаблона %{template_name}: %{input_name}"
      ],
      "Unknown remote execution feature %s": [
        "Неизвестная функция удаленного выполнения: %s"
      ],
      "Unsupported or no operating system found for this host.": [
        "Не поддерживается, или операционная система узла не обнаружена."
      ],
      "Update a foreign input set": [
        "Обновить набор входных параметров"
      ],
      "Update a job template": [
        "Обновить шаблон задания"
      ],
      "Use default description template": [
        "Использовать описание из шаблона"
      ],
      "Use legacy form": [
        ""
      ],
      "Use new job wizard": [
        ""
      ],
      "User Inputs": [
        ""
      ],
      "User can not execute job on host %s": [
        "Пользователь не может запустить задание на %s"
      ],
      "User can not execute job on infrastructure host %s": [
        ""
      ],
      "User can not execute this job template": [
        "Пользователь не может запустить этот шаблон задания"
      ],
      "User can not execute this job template on %s": [
        "Пользователь не может запустить этот шаблон задания на %s"
      ],
      "User input": [
        "Ввод пользователя"
      ],
      "Value": [
        "Значение"
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
      "View task": [
        ""
      ],
      "Web Console": [
        ""
      ],
      "Weekly": [
        "Еженедельный"
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "Команда для переключения в режим действующего пользователя. Возможные варианты: %s"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "Пользователь, от имени которого будет запускаться сценарий (по принципу sudo)"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "Пользователь, от имени которого будет запускаться сценарий (по принципу sudo). По умолчанию определяется параметрами шаблона или глобальными параметрами."
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        ""
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        ""
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        ""
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "Разрешает переопределение действующего пользователя из формы вызова."
      ],
      "Whether or not the template is locked for editing": [
        "Сообщает о блокировании шаблона для редактирования"
      ],
      "Whether the current user login should be used as the effective user": [
        "Разрешает текущему пользователю выступать в роли действующего пользователя"
      ],
      "Whether to overwrite the template if it already exists": [
        "Перезаписывать ли существующий шаблон"
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "Разрешает синхронизацию шаблонов с диска во время выполнения db:seed."
      ],
      "Yes (override)": [
        ""
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "У вас нет доступа к используемому шаблону. При сохранении формы он будет автоматически отключен."
      ],
      "You are not authorized to perform this action.": [
        "Недостаточно полномочий для выполнения операции"
      ],
      "You have %s results to display. Showing first %s results": [
        ""
      ],
      "You have more results to display. Showing first %s results": [
        ""
      ],
      "add an input set for this template to reference a different template inputs": [
        "Добавить набор входных параметров из другого шаблона"
      ],
      "cancelled": [
        "отменено"
      ],
      "default_capsule method missing from SmartProxy": [
        ""
      ],
      "documentation": [
        "документация"
      ],
      "effective user": [
        ""
      ],
      "error during rendering: %s": [
        "ошибка при обработке шаблонов: %s"
      ],
      "evaluates just after you submit this form": [
        ""
      ],
      "evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it": [
        ""
      ],
      "failed": [
        "ошибка"
      ],
      "here": [
        "здесь"
      ],
      "host already has an execution interface": [
        "для этого узла уже настроен интерфейс выполнения"
      ],
      "hosts": [
        "узлу(ам)"
      ],
      "in %s": [
        "в %s"
      ],
      "included template '%s' not found": [
        "связанный шаблон «%s» не найден"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "ожидается макрос «%s», но входных параметров с таким именем для этого шаблона не обнаружено"
      ],
      "is day of month (range: 1-31)": [
        "— день месяца (1–31)"
      ],
      "is day of week (range: 0-6)": [
        "— день недели (0–6)"
      ],
      "is hour (range: 0-23)": [
        "— часы (1–24)"
      ],
      "is minute (range: 0-59)": [
        "— минуты (0–59)"
      ],
      "is month (range: 1-12)": [
        "— месяц (1–12)"
      ],
      "no": [
        "нет"
      ],
      "occurences": [
        ""
      ],
      "open-help-tooltip-button": [
        ""
      ],
      "queued": [
        "в очереди"
      ],
      "queued to start executing in %{time}": [
        ""
      ],
      "range: 0-59": [
        ""
      ],
      "remove template input set": [
        "удалить набор входных данных шаблона"
      ],
      "running %{percent}%%": [
        ""
      ],
      "seconds": [
        "секунд"
      ],
      "succeeded": [
        "завершено"
      ],
      "task aborted succesfully": [
        ""
      ],
      "tasks at a time": [
        ""
      ],
      "template": [
        "шаблон"
      ],
      "unknown status": [
        "неизвестный статус"
      ],
      "using ": [
        ""
      ],
      "using Smart Proxy": [
        ""
      ],
      "view host names": [
        ""
      ],
      "view the hosts": [
        ""
      ],
      "yes": [
        "да"
      ]
    }
  }
};