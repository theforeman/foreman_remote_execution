 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['ko'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "FULL NAME <EMAIL@ADDRESS>",
        "Language-Team": "Korean (http://www.transifex.com/foreman/foreman/language/ko/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ko",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "ko",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "이미 다른 인터페이스가 실행 인터페이스로 설정되어 있습니다. 이 인터페이스를 대신 사용하시겠습니까?"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "상태를 업데이트하는 도중 오류가 발생했습니다. 페이지를 새로 고쳐 보십시오."
      ],
      "List foreign input sets": [
        "외부 입력 세트 나열"
      ],
      "Show foreign input set details": [
        "외부 입력 세트 정보 표시"
      ],
      "Target template ID": [
        "대상 템플릿 ID"
      ],
      "Include all inputs from the foreign template": [
        ""
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "외부 템플릿에서 포함되는 입력 이름의 쉼표로 구분된 목록입니다."
      ],
      "Input set description": [
        "입력 세트 설명"
      ],
      "Create a foreign input set": [
        "외부 입력 세트 생성"
      ],
      "Delete a foreign input set": [
        "외부 입력 세트 삭제"
      ],
      "Update a foreign input set": [
        "외부 입력 세트 업데이트"
      ],
      "List job invocations": [
        "작업 호출 나열"
      ],
      "Show job invocation": [
        "작업 호출 표시"
      ],
      "Show Job status for the hosts": [
        ""
      ],
      "The job template to use, parameter is required unless feature was specified": [
        ""
      ],
      "Invocation type, one of %s": [
        "호출 유형(%s 중 하나)"
      ],
      "Execute the jobs on hosts in randomized order": [
        ""
      ],
      "Inputs to use": [
        "사용할 입력"
      ],
      "SSH provider specific options": [
        "SSH 공급자 관련 옵션"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "사용자가 스크립트를 실행하는 데 사용해야 할 옵션입니다(sudo와 유사한 메커니즘 사용). 템플릿 매개 변수 또는 글로벌 설정으로 기본 설정됩니다."
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
        "반복 작업 생성"
      ],
      "How often the job should occur, in the cron format": [
        "cron 형식으로 설정하는 작업 발생 빈도입니다."
      ],
      "Repeat a maximum of N times": [
        "최대 N번 반복"
      ],
      "Perform no more executions after this time": [
        "이 시간 이후 더 이상 실행을 수행하지 않음"
      ],
      "Designation of a special purpose": [
        ""
      ],
      "Schedule the job to start at a later time": [
        "나중에 시작하도록 작업 스케줄"
      ],
      "Schedule the job for a future time": [
        "이후 시간에 대해 작업 스케줄"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "이 시간 전에 시작할 수 없는 경우 작업을 취소한다는 것을 나타냅니다."
      ],
      "Control concurrency level and distribution over time": [
        "동시 실행 레벨 및 기간별 배분 제어"
      ],
      "Run at most N tasks at a time": [
        "한 번에 최대 N개 태스크 실행"
      ],
      "Override the description format from the template for this invocation only": [
        "이 호출에 대한 템플릿에서만 설명 형식 덮어쓰기"
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
        "작업 호출 생성"
      ],
      "Get output for a host": [
        "호스트에 대한 출력 가져오기"
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
        "ID가 '%{id}'인 호스트를 찾을 수 없습니다."
      ],
      "Only one of feature or job_template_id can be specified": [
        ""
      ],
      "List job templates": [
        "작업 템플릿 나열"
      ],
      "List job templates per location": [
        "위치별 작업 템플릿 나열"
      ],
      "List job templates per organization": [
        "조직별 작업 템플릿 나열"
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
        "작업 템플릿 정보 표시"
      ],
      "Template name": [
        "템플릿 이름"
      ],
      "Job category": [
        "작업 카테고리"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "이 템플릿은 설명을 생성하는 데 사용됩니다. %{package} 구문을 통해 입력 값을 사용할 수 있습니다. 또한 %{job_category} 및 %{template_name}을(를) 사용하여 작업 카테고리와 템플릿 이름을 포함할 수도 있습니다."
      ],
      "Provider type": [
        "공급자 유형"
      ],
      "Whether or not the template is locked for editing": [
        "편집을 위한 템플릿의 잠금 여부 "
      ],
      "Effective user options": [
        "유효 사용자 옵션"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "사용자가 스크립트를 실행하는 데 사용해야 할 옵션입니다(sudo와 유사한 메커니즘 사용)."
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "호출할 유효 사용자를 덮어쓰도록 허용할지 여부입니다."
      ],
      "Whether the current user login should be used as the effective user": [
        "현재 사용자 로그인을 유효 사용자로 사용할지 여부입니다."
      ],
      "Create a job template": [
        "작업 템플릿 생성"
      ],
      "Update a job template": [
        "작업 템플릿 업데이트"
      ],
      "Template version": [
        "템플릿 버전"
      ],
      "Delete a job template": [
        "작업 템플릿 삭제"
      ],
      "Clone a provision template": [
        "프로비저닝 템플릿 복제"
      ],
      "List remote execution features": [
        "원격 실행 기능 나열"
      ],
      "Show remote execution feature": [
        "원격 실행 기능 표시"
      ],
      "Job template ID to be used for the feature": [
        "기능에 사용할 작업 템플릿 ID입니다."
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
        "템플릿을 미리 보는 도중 문제가 발생했습니다: %{error}. 미리 보기 전에 템플릿 입력 변경 내용을 저장해야 합니다."
      ],
      "Job template imported successfully.": [
        ""
      ],
      "Unable to save template. Correct highlighted errors": [
        ""
      ],
      "Run": [
        "실행"
      ],
      "Schedule Remote Job": [
        ""
      ],
      "Jobs": [
        "작업"
      ],
      "Job invocations": [
        "작업 호출"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        ""
      ],
      "Success": [
        "성공"
      ],
      "Failed": [
        "실패"
      ],
      "Pending": [
        "보류 중 "
      ],
      "Cancelled": [
        "취소함"
      ],
      "queued to start executing in %{time}": [
        ""
      ],
      "queued": [
        "대기열에 추가됨"
      ],
      "running %{percent}%%": [
        ""
      ],
      "succeeded": [
        "성공"
      ],
      "cancelled": [
        "취소함"
      ],
      "failed": [
        "실패함"
      ],
      "unknown status": [
        "알 수 없는 상태"
      ],
      "Any Organization": [
        "모든 조직 "
      ],
      "Any Location": [
        "모든 위치 "
      ],
      "error": [
        ""
      ],
      "Host detail": [
        "호스트 정보"
      ],
      "Rerun on %s": [
        "%s에 재실행"
      ],
      "Host task": [
        ""
      ],
      "N/A": [
        "해당 없음 "
      ],
      "Run Job": [
        "작업 실행"
      ],
      "Create Report": [
        ""
      ],
      "Create report for this job": [
        ""
      ],
      "Rerun": [
        "재실행"
      ],
      "Rerun the job": [
        "작업 재실행"
      ],
      "Rerun failed": [
        "재실행 실패"
      ],
      "Rerun on failed hosts": [
        "실패한 호스트에서 재실행"
      ],
      "Job Task": [
        "작업 태스크"
      ],
      "See the last task details": [
        "마지막 태스크 정보 표시"
      ],
      "Cancel Job": [
        "작업 취소 "
      ],
      "Try to cancel the job": [
        "작업 취소 시도"
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
        "작업 자세히"
      ],
      "See the task details": [
        "태스크 정보 표시"
      ],
      "Try to cancel the job on a host": [
        "호스트에 대한 작업 취소 시도"
      ],
      "Try to abort the job on a host without waiting for its result": [
        ""
      ],
      "Could not render the preview because no host matches the search query.": [
        ""
      ],
      "in %s": [
        "%s"
      ],
      "%s ago": [
        "%s 전 "
      ],
      "Use default description template": [
        "기본 설명 템플릿 사용"
      ],
      "Description template": [
        "설명 템플릿"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        ""
      ],
      "Could not use any template used in the job invocation": [
        "작업 호출에 사용된 템플릿을 사용할 수 없습니다."
      ],
      "Failed rendering template: %s": [
        "템플릿 렌더링 실패: %s"
      ],
      "Task cancelled": [
        ""
      ],
      "Job execution failed": [
        ""
      ],
      "%{description} on %{host}": [
        "%{host}에 대한 %{description}"
      ],
      "Remote action:": [
        "원격 작업:"
      ],
      "Job cancelled by user": [
        ""
      ],
      "Exit status: %s": [
        "종료 상태: %s"
      ],
      "Job finished with error": [
        "작업을 마쳤지만 오류가 발생했습니다."
      ],
      "Error loading data from proxy": [
        "프록시에서 데이터를 로드하는 도중 오류가 발생했습니다."
      ],
      "User can not execute job on host %s": [
        "사용자가 %s 호스트에 대해 작업을 실행할 수 없습니다."
      ],
      "User can not execute this job template": [
        "사용자가 이 작업 템플릿을 실행할 수 없습니다."
      ],
      "User can not execute job on infrastructure host %s": [
        ""
      ],
      "User can not execute this job template on %s": [
        "사용자가 %s에 대해 이 작업 템플릿을 실행할 수 없습니다."
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "적용 가능한 유일한 프록시인 %{proxy_names}이(가) 작동하지 않습니다."
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
        "포함된 템플릿 '%s'을(를) 찾을 수 없습니다."
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "이름이 '%s'인 입력 매크로를 사용했지만 이 템플릿에 대해 해당 이름의 입력이 정의되지 않았습니다."
      ],
      "Unable to fetch public key": [
        "공개 키를 가져올 수 없습니다."
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
        "호스트에 실행 인터페이스가 이미 있습니다."
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "이 템플릿은 잠겨 있습니다. 사용자 정의하려면 이를 새 템플릿에 복제하십시오. "
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "외부 입력 세트 '%{template}' -> '%{target_template}'의 순환 종속 관계가 감지되었습니다. 템플릿 스택: %{templates_stack}"
      ],
      "Execution": [
        "실행"
      ],
      "Last execution succeeded": [
        "성공한 마지막 실행"
      ],
      "No execution finished yet": [
        "아직 완료된 실행이 없습니다."
      ],
      "Last execution cancelled": [
        ""
      ],
      "Last execution failed": [
        "실패한 마지막 실행"
      ],
      "Unknown execution status": [
        "알 수 없는 실행 상태"
      ],
      "Recursive rendering of templates detected": [
        "템플릿의 반복 렌더링이 감지되었습니다."
      ],
      "error during rendering: %s": [
        "렌더링 도중 오류가 발생했습니다: %s"
      ],
      "template": [
        "템플릿"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "bookmark_id와 search_query를 모두 지정할 수 없습니다."
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "%{template_name} 템플릿에 대한 알 수 없는 입력 %{input_name}"
      ],
      "Template with id '%{id}' was not found": [
        "ID가 '%{id}'인 템플릿을 찾을 수 없습니다."
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "%{template_name} 템플릿에 대한 기능 입력 %{input_name}이(가) 정의되지 않았습니다."
      ],
      "No template mapped to feature %{feature_name}": [
        "%{feature_name} 기능에 매핑된 템플릿이 없습니다."
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "사용자가 %{feature_name} 기능에 매핑된 %{template_name} 템플릿에 액세스할 수 없습니다."
      ],
      "Job Invocation": [
        "작업 호출"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "중복된 입력이 감지되었습니다: %{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "알 수 없는 원격 실행 기능 %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "유효 사용자 메서드 \\\"%{current_value}\\\"이(가) %{valid_methods} 중 하나가 아닙니다."
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
        "정적 쿼리"
      ],
      "Dynamic Query": [
        "동적 쿼리"
      ],
      "Alphabetical": [
        ""
      ],
      "Randomized": [
        ""
      ],
      "Cannot resolve hosts without a user": [
        "사용자가 없는 호스트를 확인할 수 없습니다."
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "북마크 또는 검색 쿼리가 없는 호스트를 확인할 수 없습니다."
      ],
      "Must select a bookmark or enter a search query": [
        "북마크를 선택하거나 검색 쿼리를 입력해야 합니다."
      ],
      "Input": [
        "입력"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "값이 없는 필수 입력이 있습니다. 누락된 입력: %s"
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
        "이름"
      ],
      "State": [
        "상태 "
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
        "스케줄 "
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
        "초"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "대상 호스트"
      ],
      "Bookmark": [
        "북마크 "
      ],
      "Manual selection": [
        "수동 선택"
      ],
      "using ": [
        ""
      ],
      "Execution order": [
        ""
      ],
      "Organization": [
        "조직 "
      ],
      "Location": [
        "위치"
      ],
      "SSH User": [
        ""
      ],
      "Evaluated at:": [
        "평가 시점:"
      ],
      "User Inputs": [
        ""
      ],
      "Description": [
        "설명"
      ],
      "Job template": [
        "작업 템플릿"
      ],
      "Resolves to": [
        "다음으로 확인"
      ],
      "hosts": [
        "호스트"
      ],
      "Refresh": [
        "새로고침 "
      ],
      "Preview": [
        "미리 보기"
      ],
      "Display advanced fields": [
        "고급 필드 표시"
      ],
      "Hide advanced fields": [
        "고급 필드 숨기기"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "유효 사용자"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "스크립트를 실행하는 데 사용할 사용자입니다. 이 사용자가 SSH 사용자와 다른 경우 su 또는 sudo를 사용하여 계정을 전환합니다."
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
        "암호 "
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
        "동시 실행 레벨"
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
        "쿼리 유형"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "동적 쿼리를 선택했기 때문에 최종 호스트 목록이 변경될 수 있습니다. 실행 도중에 재실행됩니다."
      ],
      "...and %{count} more": [
        "",
        ""
      ],
      "No hosts found.": [
        "호스트를 찾을 수 없습니다."
      ],
      "Close": [
        "종료"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        ""
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        ""
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "동적 쿼리 '%{query}'이(가) 아직 확인되지 않았습니다. 확인할 대상 호스트의 목록을 %{here}에서 볼 수 있습니다."
      ],
      "here": [
        "여기 "
      ],
      "effective user": [
        ""
      ],
      "Total hosts": [
        "총 호스트"
      ],
      "Hosts gone missing": [
        ""
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        ""
      ],
      "Providers and templates": [
        "공급자 및 템플릿"
      ],
      "User input": [
        "사용자 입력"
      ],
      "Value": [
        "값 "
      ],
      "Search Query": [
        ""
      ],
      "Status": [
        "상태"
      ],
      "Succeeded": [
        "성공"
      ],
      "Start": [
        "시작"
      ],
      "Job invocation": [
        "작업 호출"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "개요"
      ],
      "Preview templates": [
        ""
      ],
      "Recurring logic": [
        "반복 로직"
      ],
      "Job Invocations": [
        ""
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        ""
      ],
      "Learn more about this in the documentation.": [
        "설명서에서 자세한 내용을 참조하십시오."
      ],
      "Job": [
        "업무"
      ],
      "Type": [
        "형태"
      ],
      "Add Foreign Input Set": [
        "외부 입력 세트 추가"
      ],
      "add an input set for this template to reference a different template inputs": [
        "이 템플릿에서 다른 템플릿 입력을 참조하기 위한 입력 세트를 추가합니다."
      ],
      "Snippet": [
        "조각 모음 "
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        ""
      ],
      "Overwrite": [
        "덮어쓰기"
      ],
      "Whether to overwrite the template if it already exists": [
        ""
      ],
      "Job Templates": [
        "작업 템플릿"
      ],
      "Edit %s": [
        "%s 편집 "
      ],
      "Edit Job Template": [
        "작업 템플릿 편집"
      ],
      "Import": [
        "불러오기"
      ],
      "New Job Template": [
        "새 작업 템플릿"
      ],
      "JobTemplate|Name": [
        "JobTemplate|이름"
      ],
      "JobTemplate|Snippet": [
        "JobTemplate|조각 모음"
      ],
      "JobTemplate|Locked": [
        "JobTemplate|잠김"
      ],
      "Actions": [
        "작업"
      ],
      "This template is locked for editing.": [
        "이 템플릿은 편집 용으로 잠금되어 있습니다. "
      ],
      "The execution interface is used for remote execution": [
        "원격 실행에 사용되는 실행 인터페이스입니다."
      ],
      "Remote execution": [
        "원격 실행"
      ],
      "Remote Execution": [
        "원격 실행"
      ],
      "Proxies": [
        "프록시 "
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "이 서브넷에 적용할 수 있는 원격 실행 프록시를 모두 선택합니다. 공급자가 동일한 프록시를 여러 개 추가한 경우 해당 프록시 간에 작업이 로드 밸런싱됩니다."
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "현재 할당된 템플릿을 볼 수 없습니다. 지금 양식을 저장하면 템플릿의 할당이 취소됩니다."
      ],
      "Remote Execution Features": [
        "원격 실행 기능"
      ],
      "Label": [
        "레이블 "
      ],
      "Edit Remote Execution Feature": [
        "원격 실행 기능 편집"
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
        "외부 입력 세트"
      ],
      "remove template input set": [
        "템플릿 입력 세트 삭제"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "외부 템플릿에서 제외되는 입력 이름의 쉼표로 구분된 목록입니다."
      ],
      "Template Invocation for %s": [
        ""
      ],
      "Back to Job": [
        "작업으로 돌아가기"
      ],
      "Toggle command": [
        "명령 토글"
      ],
      "Toggle STDERR": [
        "STDERR 토글"
      ],
      "Toggle STDOUT": [
        "STDOUT 토글"
      ],
      "Toggle DEBUG": [
        "DEBUG 토글"
      ],
      "Target: ": [
        "대상: "
      ],
      "using Smart Proxy": [
        ""
      ],
      "Scroll to bottom": [
        "맨 아래로 스크롤"
      ],
      "Scroll to top": [
        "맨 위로 스크롤"
      ],
      "Could not display data for job invocation.": [
        ""
      ],
      "Unsupported or no operating system found for this host.": [
        "지원되지 않거나 이 호스트의 운영 체제를 찾을 수 없습니다."
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
        "원격 실행 기능이 있는 모든 프록시의 호스트를 검색합니다. 호스트에 서브넷이 없거나 서브넷에 실행 프록시가 없는 경우 유용합니다."
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
        "SSH에 사용할 기본 사용자입니다. remote_execution_ssh_user라는 매개 변수를 설정하여 호스트별로 덮어쓸 수 있습니다."
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "스크립트를 실행하는 데 사용할 기본 사용자입니다. 이 사용자가 SSH 사용자와 다른 경우 su 또는 sudo를 사용하여 사용자를 전환합니다."
      ],
      "Effective User": [
        ""
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "유효 사용자를 전환하는 데 사용할 명령입니다(%s 중 하나)."
      ],
      "Effective User Method": [
        ""
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "db:seed를 실행할 때 디스크의 템플릿을 동기화할지 여부입니다."
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
        "작업 템플릿"
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
        "매달"
      ],
      "Weekly": [
        "매주"
      ],
      "Daily": [
        "매일"
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
        "호스트"
      ],
      "Host collections": [
        ""
      ],
      "Host groups": [
        "호스트 그룹 "
      ],
      "Search query": [
        "검색 쿼리"
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
        "오류 "
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
        "사용 안 함"
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
        "Cron 줄"
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
        "시작 "
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "반복"
      ],
      "Ends": [
        "종료"
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
        "분(범위: 0-59)"
      ],
      "is hour (range: 0-23)": [
        "시간(범위: 0-23)"
      ],
      "is day of month (range: 1-31)": [
        "날짜(범위: 1-31)"
      ],
      "is month (range: 1-12)": [
        "월(범위: 1-12)"
      ],
      "is day of week (range: 0-6)": [
        "요일(범위: 0-6)"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "시간"
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
        "생성 "
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "일"
      ],
      "Days of week": [
        "요일"
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
        "켜기"
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
        "기본값으로 다시 설정 "
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
        "완료"
      ],
      "Running": [
        "실행 중 "
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
        "예"
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
        "호스트"
      ],
      "Active Filters:": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "Foreman으로 원격 실행을 가져오는 플러그인입니다. 원격 관리 기능으로 구성 관리 기능을 완료합니다."
      ],
      "Action with sub plans": [
        "하위 계획이 있는 작업"
      ],
      "Import Puppet classes": [
        "Puppet 클래스 가져오기"
      ],
      "Import facts": [
        "팩트 불러오기"
      ]
    }
  }
};