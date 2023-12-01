 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['ru'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "Yulia <yulia.poyarkova@redhat.com>, 2016",
        "Language-Team": "Russian (http://www.transifex.com/foreman/foreman/language/ru/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ru",
        "Plural-Forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);",
        "lang": "ru",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "Для удаленного выполнения уже выбран другой интерфейс. Вы действительно хотите его заменить?"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "Во время обновления статуса произошла ошибка. Попробуйте обновить страницу."
      ],
      "List foreign input sets": [
        "Показать внешние наборы входных параметров"
      ],
      "Show foreign input set details": [
        "Показать информацию о внешнем наборе входных параметров"
      ],
      "Target template ID": [
        "Идентификатор подключаемого шаблона"
      ],
      "Include all inputs from the foreign template": [
        "Добавить все входные параметры из внешнего шаблона"
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "Список входных параметров, которые должны быть включены при импорте другого шаблона."
      ],
      "Input set description": [
        "Описание набора входных параметров"
      ],
      "Create a foreign input set": [
        "Создать набор входных параметров"
      ],
      "Delete a foreign input set": [
        "Удалить набор входных параметров"
      ],
      "Update a foreign input set": [
        "Обновить набор входных параметров"
      ],
      "List job invocations": [
        "Список вызовов заданий"
      ],
      "Show job invocation": [
        "Показать вызов задания"
      ],
      "Show Job status for the hosts": [
        ""
      ],
      "The job template to use, parameter is required unless feature was specified": [
        ""
      ],
      "Invocation type, one of %s": [
        "Тип вызова. Возможные значения: %s"
      ],
      "Execute the jobs on hosts in randomized order": [
        ""
      ],
      "Inputs to use": [
        "Входящие параметры"
      ],
      "SSH provider specific options": [
        "Параметры провайдера SSH"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "Пользователь, от имени которого будет запускаться сценарий (по принципу sudo). По умолчанию определяется параметрами шаблона или глобальными параметрами."
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
        "Периодическое выполнение"
      ],
      "How often the job should occur, in the cron format": [
        "Частота выполнения задания, в формате cron"
      ],
      "Repeat a maximum of N times": [
        "Количество повторений"
      ],
      "Perform no more executions after this time": [
        "Остановить после указанного числа повторений"
      ],
      "Designation of a special purpose": [
        ""
      ],
      "Schedule the job to start at a later time": [
        "Отложенный запуск"
      ],
      "Schedule the job for a future time": [
        "Настроить время запуска"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "Обозначает, что действие следует отменить, если оно не будет запущено до указанного времени."
      ],
      "Control concurrency level and distribution over time": [
        "Контроль параллельного выполнения и распределения во времени"
      ],
      "Run at most N tasks at a time": [
        "Максимальное количество параллельно выполняемых задач"
      ],
      "Override the description format from the template for this invocation only": [
        "Переопределить формат описания из шаблона только на время этого вызова"
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
        "Создать вызов задания"
      ],
      "Get output for a host": [
        "Получить данные вывода узла"
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
        "Узел «%{id}» не найден."
      ],
      "Only one of feature or job_template_id can be specified": [
        ""
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
      "Import a job template from ERB": [
        "Импорт шаблона из ERB"
      ],
      "Template ERB": [
        "ERB"
      ],
      "Overwrite template if it already exists": [
        "Перезаписать, если шаблон уже существует"
      ],
      "Export a job template to ERB": [
        "Экспорт шаблона в ERB"
      ],
      "Show job template details": [
        "Показать информацию о шаблоне"
      ],
      "Template name": [
        "Имя шаблона"
      ],
      "Job category": [
        "Категория"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "Это шаблон для генерации описания. Для того чтобы добавить переменную, используйте синтаксис %{package}; категорию задания — %{job_category}; название шаблона — %{template_name}."
      ],
      "Provider type": [
        "Тип провайдера"
      ],
      "Whether or not the template is locked for editing": [
        "Сообщает о блокировании шаблона для редактирования"
      ],
      "Effective user options": [
        "Параметры действующего пользователя"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "Пользователь, от имени которого будет запускаться сценарий (по принципу sudo)"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "Разрешает переопределение действующего пользователя из формы вызова."
      ],
      "Whether the current user login should be used as the effective user": [
        "Разрешает текущему пользователю выступать в роли действующего пользователя"
      ],
      "Create a job template": [
        "Создать шаблон задания"
      ],
      "Update a job template": [
        "Обновить шаблон задания"
      ],
      "Template version": [
        "Версия шаблона"
      ],
      "Delete a job template": [
        "Удалить шаблон задания"
      ],
      "Clone a provision template": [
        "Клонировать шаблон подготовки"
      ],
      "List remote execution features": [
        "Список функций удаленного выполнения"
      ],
      "Show remote execution feature": [
        "Показать функцию удаленного выполнения"
      ],
      "Job template ID to be used for the feature": [
        "Идентификатор шаблона задания для этой функции"
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
        "Не удалось открыть шаблон для предварительного просмотра: %{error}. Прежде чем повторить попытку, сохраните изменения входных параметров."
      ],
      "Job template imported successfully.": [
        "Импорт шаблона завершен успешно."
      ],
      "Unable to save template. Correct highlighted errors": [
        "Не удалось сохранить шаблон. Исправьте выделенные ошибки."
      ],
      "Run": [
        "Выполнить"
      ],
      "Schedule Remote Job": [
        ""
      ],
      "Jobs": [
        "Задания"
      ],
      "Job invocations": [
        "Вызовы заданий"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        ""
      ],
      "Success": [
        "Успешно"
      ],
      "Failed": [
        "Не удалась"
      ],
      "Pending": [
        "Ожидание"
      ],
      "Cancelled": [
        "Отменено"
      ],
      "queued to start executing in %{time}": [
        ""
      ],
      "queued": [
        "в очереди"
      ],
      "running %{percent}%%": [
        ""
      ],
      "succeeded": [
        "завершено"
      ],
      "cancelled": [
        "отменено"
      ],
      "failed": [
        "ошибка"
      ],
      "unknown status": [
        "неизвестный статус"
      ],
      "Any Organization": [
        "Любая организация"
      ],
      "Any Location": [
        "Любое местонахождение"
      ],
      "error": [
        ""
      ],
      "Host detail": [
        "Свойства узла"
      ],
      "Rerun on %s": [
        "Повторить на %s"
      ],
      "Host task": [
        ""
      ],
      "N/A": [
        "Недоступно"
      ],
      "Run Job": [
        "Выполнить задание"
      ],
      "Create Report": [
        ""
      ],
      "Create report for this job": [
        ""
      ],
      "Rerun": [
        "Повторить"
      ],
      "Rerun the job": [
        "Повторно выполнить задание"
      ],
      "Rerun failed": [
        "Повторить неудавшиеся"
      ],
      "Rerun on failed hosts": [
        "Повторить на узлах с ошибками"
      ],
      "Job Task": [
        "Задача"
      ],
      "See the last task details": [
        "Показать последнюю выполненную задачу"
      ],
      "Cancel Job": [
        "Отменить"
      ],
      "Try to cancel the job": [
        "Попытаться отменить задание"
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
        "Описание задачи"
      ],
      "See the task details": [
        "Просмотр подробной информации о задаче"
      ],
      "Try to cancel the job on a host": [
        "Попытаться отменить задание на узле"
      ],
      "Try to abort the job on a host without waiting for its result": [
        ""
      ],
      "Could not render the preview because no host matches the search query.": [
        ""
      ],
      "in %s": [
        "в %s"
      ],
      "%s ago": [
        "%s назад"
      ],
      "Use default description template": [
        "Использовать описание из шаблона"
      ],
      "Description template": [
        "Шаблон описания"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        ""
      ],
      "Could not use any template used in the job invocation": [
        "Не удалось применить ни один из шаблонов, настроенных для этого вызова задания"
      ],
      "Failed rendering template: %s": [
        "Не удалось обработать шаблон: %s"
      ],
      "Task cancelled": [
        ""
      ],
      "Job execution failed": [
        ""
      ],
      "%{description} on %{host}": [
        "%{description} на %{host}"
      ],
      "Remote action:": [
        "Удаленное действие:"
      ],
      "Job cancelled by user": [
        ""
      ],
      "Exit status: %s": [
        "Код завершения: %s"
      ],
      "Job finished with error": [
        "Задание было завершено с ошибкой"
      ],
      "Error loading data from proxy": [
        "Не удалось загрузить данные с прокси"
      ],
      "User can not execute job on host %s": [
        "Пользователь не может запустить задание на %s"
      ],
      "User can not execute this job template": [
        "Пользователь не может запустить этот шаблон задания"
      ],
      "User can not execute job on infrastructure host %s": [
        ""
      ],
      "User can not execute this job template on %s": [
        "Пользователь не может запустить этот шаблон задания на %s"
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "Единственный доступный прокси, %{proxy_names}, выключен",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}",
        "Ни один из %{count} доступных прокси не работает: %{proxy_names}"
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
        "связанный шаблон «%s» не найден"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "ожидается макрос «%s», но входных параметров с таким именем для этого шаблона не обнаружено"
      ],
      "Unable to fetch public key": [
        "Не удалось получить открытый ключ"
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
        "для этого узла уже настроен интерфейс выполнения"
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "Шаблон заблокирован. Скопируйте его для создания нового шаблона на его основе."
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "При добавлении входных параметров из «%{template}» в «%{target_template}» была обнаружена циклическая зависимость. Стек: %{templates_stack}"
      ],
      "Execution": [
        "Выполнение"
      ],
      "Last execution succeeded": [
        "Выполнено успешно"
      ],
      "No execution finished yet": [
        "Ни один цикл выполнения не завершился"
      ],
      "Last execution cancelled": [
        ""
      ],
      "Last execution failed": [
        "Ошибка выполнения"
      ],
      "Unknown execution status": [
        "Статус выполнения неизвестен"
      ],
      "Recursive rendering of templates detected": [
        "Обнаружена рекурсия при обработке шаблонов"
      ],
      "error during rendering: %s": [
        "ошибка при обработке шаблонов: %s"
      ],
      "template": [
        "шаблон"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "bookmark_id и search_query не могут использоваться одновременно."
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "Неизвестный ввод данных из шаблона %{template_name}: %{input_name}"
      ],
      "Template with id '%{id}' was not found": [
        "Шаблон «%{id}» не найден."
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "Входной параметр %{input_name}, заданный функцией, не определен в шаблоне %{template_name}."
      ],
      "No template mapped to feature %{feature_name}": [
        "С %{feature_name} не связан ни один шаблон."
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "У этого пользователя нет доступа к шаблону %{template_name}, связанному с %{feature_name}"
      ],
      "Job Invocation": [
        "Вызов задания"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "Обнаружены дубликаты входных данных: %{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "Неизвестная функция удаленного выполнения: %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "Метод действующего пользователя, «%{current_value}», не является одним из допустимых вариантов: %{valid_methods}"
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
        "Статический"
      ],
      "Dynamic Query": [
        "Динамический"
      ],
      "Alphabetical": [
        ""
      ],
      "Randomized": [
        ""
      ],
      "Cannot resolve hosts without a user": [
        "Невозможно сформировать список узлов, не выбрав пользователя."
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "Невозможно сформировать список узлов, не выбрав закладку или не указав запрос поиска"
      ],
      "Must select a bookmark or enter a search query": [
        "Выберите закладку или введите запрос поиска"
      ],
      "Input": [
        "Параметр"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "Отсутствуют значения некоторых обязательных входных данных: %s"
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
        "Название"
      ],
      "State": [
        "Состояние"
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
        "Расписание"
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
        "секунд"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "Узлы"
      ],
      "Bookmark": [
        "Закладка"
      ],
      "Manual selection": [
        "Ручной выбор"
      ],
      "using ": [
        ""
      ],
      "Execution order": [
        ""
      ],
      "Organization": [
        "Организация"
      ],
      "Location": [
        "Местоположение"
      ],
      "SSH User": [
        ""
      ],
      "Evaluated at:": [
        "Обработано:"
      ],
      "User Inputs": [
        ""
      ],
      "Description": [
        "Описание"
      ],
      "Job template": [
        "Шаблон задания"
      ],
      "Resolves to": [
        "Применимо к "
      ],
      "hosts": [
        "узлу(ам)"
      ],
      "Refresh": [
        "Обновить"
      ],
      "Preview": [
        "Просмотр"
      ],
      "Display advanced fields": [
        "Показать дополнительные параметры"
      ],
      "Hide advanced fields": [
        "Скрыть дополнительные параметры"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "Действующий пользователь"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "Пользователь, от имени которого должен запускаться сценарий. Если отличается от пользователя SSH, для делегирования прав используется su или sudo."
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
        "Пароль"
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
        "Параллелизм"
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
        "Тип запроса"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "Окончательный список узлов может измениться, так как динамический запрос обрабатывается непосредственно во время запуска задания."
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "No hosts found.": [
        "Нет узлов."
      ],
      "Close": [
        "Закрыть"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "Динамический запрос «%{query}» еще не был обработан. Список узлов, к которым он будет применен, можно проверить %{here}."
      ],
      "here": [
        "здесь"
      ],
      "effective user": [
        ""
      ],
      "Total hosts": [
        "Всего узлов"
      ],
      "Hosts gone missing": [
        ""
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        ""
      ],
      "Providers and templates": [
        "Сервисы и шаблоны"
      ],
      "User input": [
        "Ввод пользователя"
      ],
      "Value": [
        "Значение"
      ],
      "Search Query": [
        ""
      ],
      "Status": [
        "Статус"
      ],
      "Succeeded": [
        "Успешно"
      ],
      "Start": [
        "Начало"
      ],
      "Job invocation": [
        "Вызов задания"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "Обзор"
      ],
      "Preview templates": [
        ""
      ],
      "Recurring logic": [
        "Регулярное выполнение"
      ],
      "Job Invocations": [
        ""
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        ""
      ],
      "Learn more about this in the documentation.": [
        "Обратиться к документации"
      ],
      "Job": [
        "Задание"
      ],
      "Type": [
        "Тип"
      ],
      "Add Foreign Input Set": [
        "Добавить шаблон"
      ],
      "add an input set for this template to reference a different template inputs": [
        "Добавить набор входных параметров из другого шаблона"
      ],
      "Snippet": [
        "Фрагмент"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "Выберите файл ERB для импорта шаблона. Первый комментарий ERB в шаблоне должен содержать метаданные."
      ],
      "Overwrite": [
        "Перезаписать"
      ],
      "Whether to overwrite the template if it already exists": [
        "Перезаписывать ли существующий шаблон"
      ],
      "Job Templates": [
        "Шаблоны заданий"
      ],
      "Edit %s": [
        "Изменить %s"
      ],
      "Edit Job Template": [
        "Изменить шаблон задания"
      ],
      "Import": [
        "Импорт"
      ],
      "New Job Template": [
        "Создать шаблон задания"
      ],
      "JobTemplate|Name": [
        "Имя"
      ],
      "JobTemplate|Snippet": [
        "Фрагмент"
      ],
      "JobTemplate|Locked": [
        "Заблокирован"
      ],
      "Actions": [
        "Действия"
      ],
      "This template is locked for editing.": [
        "Шаблон заблокирован."
      ],
      "The execution interface is used for remote execution": [
        "Интерфейс используется для удаленного исполнения заданий"
      ],
      "Remote execution": [
        "Удаленное выполнение"
      ],
      "Remote Execution": [
        "Удаленное выполнение"
      ],
      "Proxies": [
        "Прокси"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "Выберите все возможные прокси для этой подсети. Добавление нескольких прокси позволит равномерно распределять действия между ними."
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "У вас нет доступа к используемому шаблону. При сохранении формы он будет автоматически отключен."
      ],
      "Remote Execution Features": [
        "Функции удаленного выполнения"
      ],
      "Label": [
        "Метка"
      ],
      "Edit Remote Execution Feature": [
        "Изменение функции удаленного выполнения"
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
        "Импорт входных данных"
      ],
      "remove template input set": [
        "удалить набор входных данных шаблона"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "Список входных параметров, которые должны быть исключены при импорте другого шаблона."
      ],
      "Template Invocation for %s": [
        ""
      ],
      "Back to Job": [
        "Назад к заданию"
      ],
      "Toggle command": [
        "Показать команды"
      ],
      "Toggle STDERR": [
        "Показать STDERR"
      ],
      "Toggle STDOUT": [
        "Показать STDOUT"
      ],
      "Toggle DEBUG": [
        "Показать DEBUG"
      ],
      "Target: ": [
        "Узел:"
      ],
      "using Smart Proxy": [
        ""
      ],
      "Scroll to bottom": [
        "Перейти вниз"
      ],
      "Scroll to top": [
        "Перейти наверх"
      ],
      "Could not display data for job invocation.": [
        ""
      ],
      "Unsupported or no operating system found for this host.": [
        "Не поддерживается, или операционная система узла не обнаружена."
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
        "Искать любые прокси с возможностью удаленного запуска заданий для этого узла. Используется, если для узла не настроена подсеть или в подсети не настроен прокси-сервер."
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
        "Пользователь по умолчанию для SSH. Для того чтобы переопределить это значение для отдельных узлов, используйте параметр remote_execution_ssh_user."
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "Пользователь, от имени которого по умолчанию будет запускаться сценарий. Если отличается от пользователя SSH, для делегирования прав будет использоваться su или sudo."
      ],
      "Effective User": [
        ""
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "Команда для переключения в режим действующего пользователя. Возможные варианты: %s"
      ],
      "Effective User Method": [
        ""
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "Разрешает синхронизацию шаблонов с диска во время выполнения db:seed."
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
        "Шаблоны заданий"
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
        "Ежемесячный"
      ],
      "Weekly": [
        "Еженедельный"
      ],
      "Daily": [
        "Ежедневный"
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
        "Узлы"
      ],
      "Host collections": [
        ""
      ],
      "Host groups": [
        "Группы узлов"
      ],
      "Search query": [
        "Поисковый запрос"
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
        "Ошибка"
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
        "Никогда"
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
        "Строка Cron"
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
        "Начало"
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "Повторяется"
      ],
      "Ends": [
        "Заканчивается"
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
        "— минуты (0–59)"
      ],
      "is hour (range: 0-23)": [
        "— часы (1–24)"
      ],
      "is day of month (range: 1-31)": [
        "— день месяца (1–31)"
      ],
      "is month (range: 1-12)": [
        "— месяц (1–12)"
      ],
      "is day of week (range: 0-6)": [
        "— день недели (0–6)"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "в"
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
        "Создать"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "Дни"
      ],
      "Days of week": [
        "Дни недели"
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
        "Настроить"
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
        "Восстановить исходные"
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
        "Готово"
      ],
      "Running": [
        "Работает"
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
        "да"
      ],
      "no": [
        "нет"
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
        "Хост"
      ],
      "Active Filters:": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "Дополнительный модуль Foreman для удаленного выполнения заданий, объединяющий функции управления конфигурацией и удаленного контроля."
      ],
      "Action with sub plans": [
        "Действия с подпланами"
      ],
      "Import Puppet classes": [
        "Импорт классов Puppet"
      ],
      "Import facts": [
        "Импорт фактов"
      ]
    }
  }
};