 locales['foreman_remote_execution'] = locales['foreman_remote_execution'] || {}; locales['foreman_remote_execution']['ja'] = {
  "domain": "foreman_remote_execution",
  "locale_data": {
    "foreman_remote_execution": {
      "": {
        "Project-Id-Version": "foreman_remote_execution 9.0.1",
        "Report-Msgid-Bugs-To": "",
        "PO-Revision-Date": "2016-02-15 13:54+0000",
        "Last-Translator": "elobato <elobatocs@gmail.com>, 2017",
        "Language-Team": "Japanese (http://www.transifex.com/foreman/foreman/language/ja/)",
        "MIME-Version": "1.0",
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Language": "ja",
        "Plural-Forms": "nplurals=1; plural=0;",
        "lang": "ja",
        "domain": "foreman_remote_execution",
        "plural_forms": "nplurals=1; plural=0;"
      },
      "Another interface is already set as execution. Are you sure you want to use this one instead?": [
        "別のインターフェースがすでに実行として設定されています。代わりにこのインターフェースを使用しもよろしいでしょうか?"
      ],
      "There was an error while updating the status, try refreshing the page.": [
        "ステータスの更新時にエラーが発生しました。ページの更新を試行してください。"
      ],
      "List foreign input sets": [
        "外部入力セットを一覧表示"
      ],
      "Show foreign input set details": [
        "外部入力セットの詳細を表示"
      ],
      "Target template ID": [
        "ターゲットテンプレート ID"
      ],
      "Include all inputs from the foreign template": [
        "外部テンプレートからのすべての入力を含める"
      ],
      "A comma separated list of input names to be included from the foreign template.": [
        "外部テンプレートから含める入力名のコンマ区切り一覧。"
      ],
      "Input set description": [
        "入力セットの説明"
      ],
      "Create a foreign input set": [
        "外部入力セットを作成"
      ],
      "Delete a foreign input set": [
        "外部入力セットを削除"
      ],
      "Update a foreign input set": [
        "外部入力セットを更新"
      ],
      "List job invocations": [
        "ジョブ呼び出しを一覧表示"
      ],
      "Show job invocation": [
        "ジョブ呼び出しを表示"
      ],
      "Show Job status for the hosts": [
        "ホストのジョブステータスを表示"
      ],
      "The job template to use, parameter is required unless feature was specified": [
        "使用するジョブテンプレート。機能が指定されていなければ、パラメーターが必要です"
      ],
      "Invocation type, one of %s": [
        "呼び出しタイプ、%s のいずれか"
      ],
      "Execute the jobs on hosts in randomized order": [
        "ホスト上でジョブを順不同で実行します"
      ],
      "Inputs to use": [
        "使用する入力"
      ],
      "SSH provider specific options": [
        "SSH プロバイダー固有オプション"
      ],
      "What user should be used to run the script (using sudo-like mechanisms). Defaults to a template parameter or global setting.": [
        "スクリプトを実行するために使用するユーザー (sudo と同様のメカニズムを使用)。デフォルト値は、テンプレートパラメーターまたはグローバル設定です。"
      ],
      "Set password for effective user (using sudo-like mechanisms)": [
        "実行ユーザーのパスワードを設定 (sudo と同様のメカニズムを使用)"
      ],
      "Set SSH user": [
        ""
      ],
      "Set SSH password": [
        "SSH パスワードを設定"
      ],
      "Set SSH key passphrase": [
        "SSH 鍵パスフレーズを設定"
      ],
      "Create a recurring job": [
        "繰り返されるジョブを作成"
      ],
      "How often the job should occur, in the cron format": [
        "ジョブを実行する頻度 (cron 形式)"
      ],
      "Repeat a maximum of N times": [
        "最大 N 回繰り返す"
      ],
      "Perform no more executions after this time": [
        "この回数以上は実行されません"
      ],
      "Designation of a special purpose": [
        "特別な目的の指定"
      ],
      "Schedule the job to start at a later time": [
        "後で開始するジョブをスケジュール"
      ],
      "Schedule the job for a future time": [
        "将来のジョブをスケジュール"
      ],
      "Indicates that the action should be cancelled if it cannot be started before this time.": [
        "アクションはこの時刻よりも前に開始できない場合にキャンセルされることを示しています。"
      ],
      "Control concurrency level and distribution over time": [
        "同時実行レベルと分散を制御"
      ],
      "Run at most N tasks at a time": [
        "一度に最大 N タスクを実行"
      ],
      "Override the description format from the template for this invocation only": [
        "この呼び出しに対してのみテンプレートから説明形式を上書き"
      ],
      "Override the timeout interval from the template for this invocation only": [
        "この呼び出しに対してのみテンプレートからタイムアウト間隔を上書き"
      ],
      "Remote execution feature label that should be triggered, job template assigned to this feature will be used": [
        "トリガーされるリモート実行機能ラベル。この機能に割り当てられたジョブテンプレートが使用されます"
      ],
      "Override the global time to pickup interval for this invocation only": [
        ""
      ],
      "Create a job invocation": [
        "ジョブ呼び出しを作成"
      ],
      "Get output for a host": [
        "ホストの出力を取得"
      ],
      "Get raw output for a host": [
        "ホストのロー出力を取得"
      ],
      "Cancel job invocation": [
        "ジョブ呼び出しをキャンセル"
      ],
      "The job could not be cancelled.": [
        "ジョブをキャンセルすることができませんでした。"
      ],
      "Rerun job on failed hosts": [
        "失敗したホストでのジョブの再実行"
      ],
      "Could not rerun job %{id} because its template could not be found": [
        "テンプレートが見つからないのでジョブ %{id} を返すことができませんでした"
      ],
      "Get outputs of hosts in a job": [
        "ジョブ内のホストの出力を取得します"
      ],
      "Host with id '%{id}' was not found": [
        "id '%{id}' のホストが見つかりませんでした"
      ],
      "Only one of feature or job_template_id can be specified": [
        "機能または job_template_id の 1 つのみを指定できます"
      ],
      "List job templates": [
        "ジョブテンプレートを一覧表示"
      ],
      "List job templates per location": [
        "ロケーションごとのジョブテンプレートを一覧表示"
      ],
      "List job templates per organization": [
        "組織ごとのジョブテンプレートを一覧表示"
      ],
      "Import a job template from ERB": [
        "ERB からジョブテンプレートをインポート"
      ],
      "Template ERB": [
        "テンプレート ERB"
      ],
      "Overwrite template if it already exists": [
        "テンプレートがすでに存在する場合は上書きします"
      ],
      "Export a job template to ERB": [
        "ジョブテンプレートを ERB にエクスポート"
      ],
      "Show job template details": [
        "ジョブテンプレートの詳細を表示"
      ],
      "Template name": [
        "テンプレート名"
      ],
      "Job category": [
        "ジョブカテゴリー"
      ],
      "This template is used to generate the description. Input values can be used using the syntax %{package}. You may also include the job category and template name using %{job_category} and %{template_name}.": [
        "このテンプレートは、記述の生成に使用します。入力値には、構文 %{package} を使用できます。%{job_category} と %{template_name} を使用してジョブカテゴリーとテンプレート名を追加することもできます。"
      ],
      "Provider type": [
        "プロバイダータイプ"
      ],
      "Whether or not the template is locked for editing": [
        "テンプレートの編集機能をロックするかどうか"
      ],
      "Effective user options": [
        "実効ユーザーオプション"
      ],
      "What user should be used to run the script (using sudo-like mechanisms)": [
        "スクリプトを実行するために使用するユーザー (sudo と同様のメカニズムを使用)"
      ],
      "Whether it should be allowed to override the effective user from the invocation form.": [
        "呼び出し形式から実効ユーザーを上書きするのを許可するかどうか。"
      ],
      "Whether the current user login should be used as the effective user": [
        "現在のユーザーログインを実行ユーザーとして使用するかどうか"
      ],
      "Create a job template": [
        "ジョブテンプレートの作成"
      ],
      "Update a job template": [
        "ジョブテンプレートの更新"
      ],
      "Template version": [
        "テンプレートのバージョン"
      ],
      "Delete a job template": [
        "ジョブテンプレートの削除"
      ],
      "Clone a provision template": [
        "プロビジョンテンプレートのクローン"
      ],
      "List remote execution features": [
        "リモート実行機能の一覧表示"
      ],
      "Show remote execution feature": [
        "リモート実行機能の表示"
      ],
      "Job template ID to be used for the feature": [
        "機能に使用するジョブテンプレート ID"
      ],
      "List available remote execution features for a host": [
        ""
      ],
      "List template invocations belonging to job invocation": [
        "ジョブ呼び出しに属するテンプレート呼び出しの一覧表示"
      ],
      "Identifier of the Host interface for Remote execution": [
        "リモート実行用のホストインターフェイスの識別子"
      ],
      "Set 'host_registration_remote_execution_pull' parameter for the host. If it is set to true, pull provider client will be deployed on the host": [
        ""
      ],
      "List of proxy IDs to be used for remote execution": [
        "リモート実行に使用されるプロキシー ID の一覧"
      ],
      "Trying to abort the job": [
        "ジョブを中断しようとしています"
      ],
      "Trying to cancel the job": [
        "ジョブをキャンセルしようとしています"
      ],
      "The job cannot be aborted at the moment.": [
        "現在、ジョブは中断できません。"
      ],
      "The job cannot be cancelled at the moment.": [
        "現在、ジョブはキャンセルできません。"
      ],
      "Problem with previewing the template: %{error}. Note that you must save template input changes before you try to preview it.": [
        "テンプレートのプレビューでの問題: %{error}。プレビューを表示する前に、テンプレート入力の変更を保存する必要があることに注意してください。"
      ],
      "Job template imported successfully.": [
        "ジョブテンプレートが正常にインポートされました"
      ],
      "Unable to save template. Correct highlighted errors": [
        "テンプレートを保存できません。強調表示されたエラーを修正してください"
      ],
      "Run": [
        "実行"
      ],
      "Schedule Remote Job": [
        "リモートジョブのスケジュール"
      ],
      "Jobs": [
        "ジョブ"
      ],
      "Job invocations": [
        "ジョブ呼び出し"
      ],
      "%s": [
        "%s"
      ],
      "Web Console": [
        "Web コンソール"
      ],
      "Success": [
        "成功"
      ],
      "Failed": [
        "失敗"
      ],
      "Pending": [
        "保留"
      ],
      "Cancelled": [
        "キャンセル済み"
      ],
      "queued to start executing in %{time}": [
        "キューに追加して %{time} 後に実行を開始する"
      ],
      "queued": [
        "キューに登録済み"
      ],
      "running %{percent}%%": [
        "%{percent}%% 実行中"
      ],
      "succeeded": [
        "成功"
      ],
      "cancelled": [
        "キャンセル済み"
      ],
      "failed": [
        "失敗"
      ],
      "unknown status": [
        "不明なステータス"
      ],
      "Any Organization": [
        "任意の組織"
      ],
      "Any Location": [
        "任意のロケーション"
      ],
      "error": [
        "エラー"
      ],
      "Host detail": [
        "ホストの詳細"
      ],
      "Rerun on %s": [
        "%s での再実行"
      ],
      "Host task": [
        "ホストタスク"
      ],
      "N/A": [
        "N/A"
      ],
      "Run Job": [
        "ジョブを実行"
      ],
      "Create Report": [
        "レポートを作成"
      ],
      "Create report for this job": [
        "このジョブのレポートを作成"
      ],
      "Rerun": [
        "再実行"
      ],
      "Rerun the job": [
        "ジョブを再実行"
      ],
      "Rerun failed": [
        "再実行に失敗しました"
      ],
      "Rerun on failed hosts": [
        "失敗したホストでの再実行"
      ],
      "Job Task": [
        "ジョブタスク"
      ],
      "See the last task details": [
        "最後のタスク詳細を確認"
      ],
      "Cancel Job": [
        "ジョブのキャンセル"
      ],
      "Try to cancel the job": [
        "ジョブのキャンセルを試行"
      ],
      "Abort Job": [
        "ジョブの中断"
      ],
      "Try to abort the job without waiting for the results from the remote hosts": [
        "リモートホストからの結果を待たずにジョブを中断しようとしています"
      ],
      "New UI": [
        ""
      ],
      "Switch to the new job invocation detail UI": [
        ""
      ],
      "Task Details": [
        "タスクの詳細"
      ],
      "See the task details": [
        "タスク詳細を確認"
      ],
      "Try to cancel the job on a host": [
        "ホストでのジョブのキャンセルを試行"
      ],
      "Try to abort the job on a host without waiting for its result": [
        "結果を待たずにホストでジョブを中断しようとしています"
      ],
      "Could not render the preview because no host matches the search query.": [
        "検索クエリーに一致するホストがないため、プレビューをレンダリングできませんでした。"
      ],
      "in %s": [
        "%s 以内"
      ],
      "%s ago": [
        "%s 前"
      ],
      "Use default description template": [
        "デフォルトの説明テンプレートを使用"
      ],
      "Description template": [
        "説明テンプレート"
      ],
      "This template is used to generate the description.<br/>Input values can be used using the syntax %{package}.<br/>You may also include the job category and template<br/>name using %{job_category} and %{template_name}.": [
        "このテンプレートは記述の生成に使用します。<br/>入力値には、%{package} 構文を使用できますあ。<br/>ジョブカテゴリーとテンプレート<br/>名は、%{job_category} と %{template_name} を使用して追加することもできます。"
      ],
      "Could not use any template used in the job invocation": [
        "ジョブ呼び出しで使用されるテンプレートを使用できませんでした"
      ],
      "Failed rendering template: %s": [
        "テンプレートのレンダリングに失敗しました: %s"
      ],
      "Task cancelled": [
        "タスクはキャンセルされました"
      ],
      "Job execution failed": [
        "ジョブの実行に失敗しました"
      ],
      "%{description} on %{host}": [
        "%{host} の %{description} "
      ],
      "Remote action:": [
        "リモートアクション:"
      ],
      "Job cancelled by user": [
        "ジョブがユーザーによりキャンセルされました"
      ],
      "Exit status: %s": [
        "終了ステータス: %s"
      ],
      "Job finished with error": [
        "エラーでジョブが終了しました"
      ],
      "Error loading data from proxy": [
        "プロキシーからデータをロードするときにエラーが発生しました"
      ],
      "User can not execute job on host %s": [
        "ユーザーはホスト %s でジョブを実行できません"
      ],
      "User can not execute this job template": [
        "ユーザーはこのジョブテンプレートを実行できません"
      ],
      "User can not execute job on infrastructure host %s": [
        "ユーザーはインフラストラクチャーホスト %s でジョブを実行できません"
      ],
      "User can not execute this job template on %s": [
        "ユーザーは %s でこのジョブテンプレートを実行できません"
      ],
      "The only applicable proxy %{proxy_names} is down": [
        "適用可能な唯一のプロキシー %{proxy_names} がダウンしています。"
      ],
      "Could not use any proxy for the %{provider} job. Consider configuring %{global_proxy}, %{fallback_proxy} in settings": [
        "%{provider} ジョブにプロキシーを使用できませんでした。設定で {global_proxy} または {fallback_proxy} を指定することを検討してください"
      ],
      "REX job has succeeded - %s": [
        "REX ジョブが成功しました: %s"
      ],
      "REX job has failed - %s": [
        "REX ジョブが失敗しました: %s"
      ],
      "included template '%s' not found": [
        "含まれているテンプレート '%s' が見つかりません"
      ],
      "input macro with name '%s' used, but no input with such name defined for this template": [
        "'%s' という名前の入力マクロが使用されていますが、このテンプレートにはそのような名前の入力値がありません"
      ],
      "Unable to fetch public key": [
        "公開鍵を取得できません"
      ],
      "Unable to remove host from known hosts": [
        "既知のホストからホストを削除できません"
      ],
      "REX job has finished - %s": [
        "REX ジョブが終了しました: %s"
      ],
      "Should this interface be used for remote execution?": [
        "このインターフェースをリモート実行に使用する必要がありますか?"
      ],
      "Interface with the '%s' identifier was specified as a remote execution interface, however the interface was not found on the host. If the interface exists, it needs to be created in Foreman during the registration.": [
        "'%s' の識別子を持つインターフェースがリモート実行インターフェースとして指定されましたが、このインターフェースはホスト上で見つかりませんでした。インターフェースが存在する場合は、登録時に Foreman で作成する必要があります。"
      ],
      "host already has an execution interface": [
        "ホストにはすでに実行インターフェースがあります"
      ],
      "This template is locked. Please clone it to a new template to customize.": [
        "このテンプレートはロックされています。カスタマイズするには、このクローンを新規テンプレートに作成してください。"
      ],
      "Circular dependency detected in foreign input set '%{template}' -> '%{target_template}'. Templates stack: %{templates_stack}": [
        "外部入力セット '%{template}' -> '%{target_template}' で循環依存が検出されました。テンプレートスタック: %{templates_stack}"
      ],
      "Execution": [
        "Execution"
      ],
      "Last execution succeeded": [
        "成功した最後の実行"
      ],
      "No execution finished yet": [
        "完了した実行はまだありません"
      ],
      "Last execution cancelled": [
        "最後の実行がキャンセルされました"
      ],
      "Last execution failed": [
        "失敗した最後の実行"
      ],
      "Unknown execution status": [
        "不明な実行ステータス"
      ],
      "Recursive rendering of templates detected": [
        "検出されたテンプレートの再帰的なレンダリング"
      ],
      "error during rendering: %s": [
        "レンダリング中のエラー: %s"
      ],
      "template": [
        "template"
      ],
      "Cannot specify both bookmark_id and search_query": [
        "bookmark_id と search_query の両方を指定できません"
      ],
      "Unknown input %{input_name} for template %{template_name}": [
        "テンプレート %{template_name} での不明な入力 %{input_name}"
      ],
      "Template with id '%{id}' was not found": [
        "id '%{id}' のテンプレートが見つかりませんでした"
      ],
      "Feature input %{input_name} not defined in template %{template_name}": [
        "テンプレート %{template_name} に機能入力 %{input_name} が定義されていません"
      ],
      "No template mapped to feature %{feature_name}": [
        "機能 %{feature_name} にマッピングされたテンプレートがありません"
      ],
      "The template %{template_name} mapped to feature %{feature_name} is not accessible by the user": [
        "ユーザーは機能 %{template_name} にマッピングされたテンプレート %{feature_name} にアクセスできません"
      ],
      "Job Invocation": [
        "ジョブ呼び出し"
      ],
      "Duplicated inputs detected: %{duplicated_inputs}": [
        "重複した入力が検出されました: ％{duplicated_inputs}"
      ],
      "Unknown remote execution feature %s": [
        "不明なリモート実行機能 %s"
      ],
      "Effective user method \\\"%{current_value}\\\" is not one of %{valid_methods}": [
        "実効ユーザーメソッド\\\"%{current_value}\\\" は %{valid_methods} の 1 つではありません"
      ],
      "Could not find any suitable interface for execution": [
        "実行に適したインターフェースを見つけることができませんでした"
      ],
      "Subscribe to my failed jobs": [
        "自分の失敗ジョブにサブスクライブする"
      ],
      "Subscribe to my succeeded jobs": [
        "自分の成功ジョブにサブスクライブする"
      ],
      "Subscribe to all my jobs": [
        "すべての自分のジョブにサブスクライブする"
      ],
      "Script": [
        "スクリプト"
      ],
      "Static Query": [
        "静的クエリー"
      ],
      "Dynamic Query": [
        "動的クエリー"
      ],
      "Alphabetical": [
        "アルファベット順"
      ],
      "Randomized": [
        "順不同"
      ],
      "Cannot resolve hosts without a user": [
        "ユーザーなしでホストを解決できません"
      ],
      "Cannot resolve hosts without a bookmark or search query": [
        "ブックマークまたは検索クエリーなしでホストを解決できません"
      ],
      "Must select a bookmark or enter a search query": [
        "ブックマークを選択するか、検索クエリーを入力する必要があります"
      ],
      "Input": [
        "入力"
      ],
      "Not all required inputs have values. Missing inputs: %s": [
        "入力が必須のすべての項目に値があるとは限りません。足りない入力: %s"
      ],
      "Internal proxy selector can only be used if Katello is enabled": [
        "内部プロキシーセレクターは、Katello が有効になっている場合にのみ使用できます"
      ],
      "default_capsule method missing from SmartProxy": [
        "SmartProxy に default_capsule メソッドがありません"
      ],
      "Can't find Job Invocation for an id %s": [
        "ID %s のジョブ呼び出しが見つかりません"
      ],
      "Latest Jobs": [
        "最新のジョブ"
      ],
      "Name": [
        "名前"
      ],
      "State": [
        "状態"
      ],
      "Started": [
        "開始済み"
      ],
      "No jobs available": [
        "利用可能なジョブがありません"
      ],
      "Results": [
        "結果"
      ],
      "Schedule": [
        "スケジュール"
      ],
      "Concurrency level limited to": [
        "同時実行レベルの制限:"
      ],
      "tasks at a time": [
        "1 度に実行されるタスク"
      ],
      "Scheduled to start before": [
        "次の時刻よりも前に開始するようにスケジュール"
      ],
      "Scheduled to start at": [
        "開始スケジュール:"
      ],
      "Timeout to kill after": [
        "強制終了のタイムアウト:"
      ],
      "seconds": [
        "秒"
      ],
      "Time to pickup": [
        ""
      ],
      "Target hosts": [
        "ターゲットホスト"
      ],
      "Bookmark": [
        "ブックマーク"
      ],
      "Manual selection": [
        "手動選択"
      ],
      "using ": [
        "使用中 "
      ],
      "Execution order": [
        "実行順"
      ],
      "Organization": [
        "組織"
      ],
      "Location": [
        "ロケーション"
      ],
      "SSH User": [
        "SSH ユーザー"
      ],
      "Evaluated at:": [
        "評価済み:"
      ],
      "User Inputs": [
        "ユーザー入力"
      ],
      "Description": [
        "説明"
      ],
      "Job template": [
        "ジョブテンプレート"
      ],
      "Resolves to": [
        "解決:"
      ],
      "hosts": [
        "ホスト"
      ],
      "Refresh": [
        "更新"
      ],
      "Preview": [
        "プレビュー"
      ],
      "Display advanced fields": [
        "詳細フィールドを表示"
      ],
      "Hide advanced fields": [
        "詳細フィールドを非表示"
      ],
      "SSH user": [
        ""
      ],
      "A user to be used for SSH.": [
        ""
      ],
      "Effective user": [
        "実効ユーザー"
      ],
      "A user to be used for executing the script. If it differs from the SSH user, su or sudo is used to switch the accounts.": [
        "スクリプトを実行するために使用するユーザー。ユーザーが SSH ユーザーと異なる場合は、su または sudo を使用してアカウントを切り替えます。"
      ],
      "Timeout to kill": [
        "強制終了までのタイムアウト"
      ],
      "Time in seconds from the start on the remote host after which the job should be killed.": [
        "リモートホストで開始してからジョブを強制終了するまでの時間 (秒単位)"
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled.": [
        ""
      ],
      "Password": [
        "パスワード"
      ],
      "Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "パスワードは、ジョブが完了するまで暗号化されて DB に保存されます。将来の実行または繰り返しの実行の場合、最後の実行後に削除されます。"
      ],
      "Private key passphrase": [
        "秘密鍵のパスフレーズ"
      ],
      "Key passhprase is only applicable for SSH provider. Other providers ignore this field. <br> Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "鍵パスフレーズは、SSH プロバイダーにのみ適用されます。他のプロバイダーは、このフィールドを無視します。<br>パスフレーズは、ジョブが完了するまで暗号化されて DB に保存されます。将来の実行または繰り返しの実行の場合、最後の実行後に削除されます。"
      ],
      "Effective user password": [
        "実効ユーザーパスワード"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. <br> Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "実効ユーザーパスワードは、SSH プロバイダーにのみ適用されます。他のプロバイダーは、このフィールドを無視します。<br>パスワードは、ジョブが完了するまで暗号化されて DB に保存されます。将来の実行または繰り返しの実行の場合、最後の実行後に削除されます。"
      ],
      "Concurrency level": [
        "同時実行レベル"
      ],
      "Run at most N tasks at a time. If this is set and proxy batch triggering is enabled, then tasks are triggered on the smart proxy in batches of size 1.": [
        "1 回に最大 N 個のタスクを実行します。この値が設定されていて、プロキシーバッチのトリガーが有効な場合には、タスクはサイズ 1 の単位で一括して、Smart Proxy でトリガーされます。"
      ],
      "Execution ordering": [
        "実行順"
      ],
      "Execution ordering determines whether the jobs should be executed on hosts in alphabetical order or in randomized order.<br><ul><li><b>Ordered</b> - executes the jobs on hosts in alphabetical order</li><li><b>Randomized</b> - randomizes the order in which jobs are executed on hosts</li></ul>": [
        "実行順では、ホスト上でジョブをアルファベット順で実行するか、順不同で実行するかを決定します。<br><ul><li><b>順番</b>: ホスト上でジョブがアルファベット順に実行されます。</li><li><b>無作為</b>: ホスト上でジョブが順不同で実行されます。</li></ul>"
      ],
      "Type of query": [
        "クエリーのタイプ"
      ],
      "Type has impact on when is the query evaluated to hosts.<br><ul><li><b>Static</b> - evaluates just after you submit this form</li><li><b>Dynamic</b> - evaluates just before the execution is started, so if it's planned in future, targeted hosts set may change before it</li></ul>": [
        ""
      ],
      "The final host list may change because the selected query is dynamic.  It will be rerun during execution.": [
        "選択されたクエリーが動的であるため、最終ホスト一覧は変更される場合があります。実行中に再実行されます。"
      ],
      "...and %{count} more": [
        "...さらに %{count}"
      ],
      "No hosts found.": [
        "ホストが見つかりません。"
      ],
      "Close": [
        "閉じる"
      ],
      "Current organization %{org_c} is different from job's organization %{org_j}.": [
        "現在の組織「%{org_c}」はジョブの組織「％{org_j}」とは異なります。"
      ],
      "Current location %{loc_c} is different from job's location %{loc_j}.": [
        "現在のロケーション %{loc_c} はジョブのロケーション %{loc_j} とは異なります。"
      ],
      "The dynamic query '%{query}' was not resolved yet. The list of hosts to which it would resolve now can be seen %{here}.": [
        "動的クエリー '%{query}' が解決されませんでした。解決するホストの一覧は %{here} に表示されます。"
      ],
      "here": [
        "こちら"
      ],
      "effective user": [
        "実効ユーザー"
      ],
      "Total hosts": [
        "ホストの合計数"
      ],
      "Hosts gone missing": [
        "ホストが行方不明になりました"
      ],
      "This can happen if the host is removed or moved to another organization or location after the job was started": [
        "これは、ジョブの開始後にホストが削除されたり、別の組織またはロケーションに移動されたりした場合に発生する可能性があります"
      ],
      "Providers and templates": [
        "プロバイダーおよびテンプレート"
      ],
      "User input": [
        "ユーザー入力"
      ],
      "Value": [
        "値"
      ],
      "Search Query": [
        "検索クエリー"
      ],
      "Status": [
        "状態"
      ],
      "Succeeded": [
        "成功"
      ],
      "Start": [
        "開始"
      ],
      "Job invocation": [
        "ジョブ呼び出し"
      ],
      "Use new job wizard": [
        ""
      ],
      "Overview": [
        "概要"
      ],
      "Preview templates": [
        "テンプレートのプレビュー"
      ],
      "Recurring logic": [
        "再帰論理"
      ],
      "Job Invocations": [
        "ジョブ呼び出し"
      ],
      "Foreman can run arbitrary commands on remote hosts using different providers, such as SSH or Ansible. Communication goes through the Smart Proxy so Foreman does not have to have direct access to the target hosts and can scale to control many hosts.": [
        "Foreman は SSH または Ansible など異なるプロバイダーを使用して、リモートホストで任意のコマンドを実行できます。通信は Smart Proxy 経由で送信されるので、Foreman はターゲットホストに直接アクセスする必要はなく、多くのホストを制御するためにスケーリングできます。"
      ],
      "Learn more about this in the documentation.": [
        "詳細についてはドキュメントを参照してください。"
      ],
      "Job": [
        "ジョブ"
      ],
      "Type": [
        "タイプ"
      ],
      "Add Foreign Input Set": [
        "外部入力セットを追加"
      ],
      "add an input set for this template to reference a different template inputs": [
        "異なるテンプレート入力を参照するためにこのテンプレートの入力セットを追加"
      ],
      "Snippet": [
        "スニペット"
      ],
      "Select an ERB file to upload in order to import a job template.  The template must contain metadata in the first ERB comment.": [
        "ジョブテンプレートをインポートするためにアップロードする ERB ファイルを選択します。テンプレートの最初の ERB コメントにはメタデータが含まれている必要があります。"
      ],
      "Overwrite": [
        "上書き"
      ],
      "Whether to overwrite the template if it already exists": [
        "テンプレートがすでに存在する場合にテンプレートを上書きするかどうか"
      ],
      "Job Templates": [
        "ジョブテンプレート"
      ],
      "Edit %s": [
        "%s の編集"
      ],
      "Edit Job Template": [
        "ジョブテンプレートの編集"
      ],
      "Import": [
        "インポート"
      ],
      "New Job Template": [
        "新規ジョブテンプレート"
      ],
      "JobTemplate|Name": [
        "名前"
      ],
      "JobTemplate|Snippet": [
        "スニペット"
      ],
      "JobTemplate|Locked": [
        "ロック済み"
      ],
      "Actions": [
        "アクション"
      ],
      "This template is locked for editing.": [
        "このテンプレートは編集機能がロックされています。"
      ],
      "The execution interface is used for remote execution": [
        "リモート実行には実行インターフェースが使用されます"
      ],
      "Remote execution": [
        "リモート実行"
      ],
      "Remote Execution": [
        "リモート実行"
      ],
      "Proxies": [
        "プロキシー"
      ],
      "Select as many remote execution proxies as applicable for this subnet.  When multiple proxies with the same provider are added, actions will be load balanced among them.": [
        "このサブネットに適用可能なすべてのリモート実行プロキシーを選択します。同じプロバイダーを使用するプロキシーが複数追加された場合は、プロキシー間で負荷が分散されます。"
      ],
      "You are not allowed to see the currently assigned template. Saving the form now would unassign the template.": [
        "現在割り当てられているテンプレートを参照できません。フォームを保存すると、テンプレートの割り当てが解除されます。"
      ],
      "Remote Execution Features": [
        "リモート実行機能"
      ],
      "Label": [
        "ラベル"
      ],
      "Edit Remote Execution Feature": [
        "リモート実行機能の編集"
      ],
      "A job '%{job_name}' has %{status} at %{time}": [
        "ジョブ '%{job_name}' のステータスは %%{status} です (%%{time} 時点)"
      ],
      "Job result": [
        "ジョブの結果"
      ],
      "Failed hosts": [
        "失敗したホスト"
      ],
      "See more details at %s": [
        "詳細は %s を確認してください"
      ],
      "Foreign input set": [
        "外部入力セット"
      ],
      "remove template input set": [
        "テンプレート入力セットの削除"
      ],
      "A comma separated list of input names to be excluded from the foreign template.": [
        "外部テンプレートから除外する入力名のコンマ区切り一覧。"
      ],
      "Template Invocation for %s": [
        "%s のテンプレート呼び出し"
      ],
      "Back to Job": [
        "ジョブに戻る"
      ],
      "Toggle command": [
        "コマンドの切り替え"
      ],
      "Toggle STDERR": [
        "STDERR の切り替え"
      ],
      "Toggle STDOUT": [
        "STDOUT の切り替え"
      ],
      "Toggle DEBUG": [
        "DEBUG の切り替え"
      ],
      "Target: ": [
        "ターゲット: "
      ],
      "using Smart Proxy": [
        "Smart Proxy を使用"
      ],
      "Scroll to bottom": [
        "最下部へスクロール"
      ],
      "Scroll to top": [
        "最上部へスクロール"
      ],
      "Could not display data for job invocation.": [
        "ジョブ呼び出しのデータを表示できませんでした。"
      ],
      "Unsupported or no operating system found for this host.": [
        "サポートされていないか、このホストのオペレーティングシステムが見つかりません。"
      ],
      "A job '%{subject}' has finished successfully": [
        "ジョブ '%{subject}' が正常に完了しました。"
      ],
      "Job Details": [
        "ジョブの詳細"
      ],
      "A job '%{subject}' has failed": [
        "ジョブ '%%{subject}' が失敗しました"
      ],
      "Remote execution job": [
        "リモート実行ジョブ"
      ],
      "A notification when a job finishes": [
        "ジョブの完了時の通知"
      ],
      "Unable to create mail notification: %s": [
        "メールの通知を作成できません: %s"
      ],
      "Search the host for any proxy with Remote Execution, useful when the host has no subnet or the subnet does not have an execution proxy": [
        "リモート実行があるプロキシーをホストで検索します。ホストにサブネットがない場合、またはサブネットに実行プロキシーがない場合に役に立ちます"
      ],
      "Fallback to Any Proxy": [
        "プロキシーへのフォールバック"
      ],
      "Search for remote execution proxy outside of the proxies assigned to the host. The search will be limited to the host's organization and location.": [
        "ホストに割り当てられたプロキシー以外のリモート実行プロキシーを検索します。検索はホストの組織とロケーションに限定されます。"
      ],
      "Enable Global Proxy": [
        "グローバルプロキシーを有効にする"
      ],
      "Default user to use for SSH.  You may override per host by setting a parameter called remote_execution_ssh_user.": [
        "SSH に使用するデフォルトユーザー。remote_execution_ssh_user という名前のパラメーターを設定することにより、ホストごとに上書きできます。"
      ],
      "Default user to use for executing the script. If the user differs from the SSH user, su or sudo is used to switch the user.": [
        "スクリプトを実行するために使用するデフォルトユーザー。ユーザーが SSH ユーザーと異なる場合は、su または sudo を使用してユーザーを切り替えます。"
      ],
      "Effective User": [
        "実効ユーザー"
      ],
      "What command should be used to switch to the effective user. One of %s": [
        "実効ユーザーへの切り替えるに使用するコマンド。%s のいずれか"
      ],
      "Effective User Method": [
        "実効ユーザーメソッド"
      ],
      "Whether we should sync templates from disk when running db:seed.": [
        "db:seed を実行するときにディスクからテンプレートを同期するかどうか。"
      ],
      "Sync Job Templates": [
        "ジョブテンプレートの同期"
      ],
      "Port to use for SSH communication. Default port 22. You may override per host by setting a parameter called remote_execution_ssh_port.": [
        "SSH 通信に使用するポート。デフォルトのポートは 22 です。remote_execution_ssh_port という名前のパラメーターを設定することにより、ホストごとに上書きできます。"
      ],
      "SSH Port": [
        "SSH ポート"
      ],
      "Should the ip addresses on host interfaces be preferred over the fqdn? It is useful when DNS not resolving the fqdns properly. You may override this per host by setting a parameter called remote_execution_connect_by_ip. For dual-stacked hosts you should consider the remote_execution_connect_by_ip_prefer_ipv6 setting": [
        "ホストインターフェースの ip アドレスは fqdn よりも優先されますか? DNS が fqdn を適切に解決しない場合、これは役に立ちます。remote_execution_connect_by_ip というパラメーターを設定し、ホストごとにこれを上書きすることができます。デュアルスタックのホストの場合は、remote_execution_connect_by_ip_prefer_ipv6 設定を検討する必要があります"
      ],
      "Connect by IP": [
        "IP で接続"
      ],
      "When connecting using ip address, should the IPv6 addresses be preferred? If no IPv6 address is set, it falls back to IPv4 automatically. You may override this per host by setting a parameter called remote_execution_connect_by_ip_prefer_ipv6. By default and for compatibility, IPv4 will be preferred over IPv6 by default": [
        "ip address を使用して接続する場合は、IPv6 アドレスを優先する必要がありますか? IPv6 アドレスが設定されていない場合は、IPv4 に自動的にフォールバックします。remote_execution_connect_by_ip_prefer_ipv6 というパラメーターを設定し、ホストごとにこれを上書きすることができます。互換性のために、デフォルトでは IPv4 が IPv6 よりも優先されます"
      ],
      "Prefer IPv6 over IPv4": [
        "IPv4 よりも IPv6 を優先する"
      ],
      "Default password to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_password": [
        "SSH に使用するデフォルトパスワード。remote_execution_ssh_password という名前のパラメーターを設定することにより、ホストごとに上書きできます"
      ],
      "Default SSH password": [
        "デフォルトの SSH パスワード"
      ],
      "Default key passphrase to use for SSH. You may override per host by setting a parameter called remote_execution_ssh_key_passphrase": [
        "SSH に使用するデフォルトの鍵パスフレーズ。remote_execution_ssh_key_passphrase という名前のパラメーターを設定することにより、ホストごとに上書きできます。"
      ],
      "Default SSH key passphrase": [
        "デフォルトの SSH 鍵パスフレーズ"
      ],
      "Amount of workers in the pool to handle the execution of the remote execution jobs. Restart of the dynflowd/foreman-tasks service is required.": [
        "リモート実行ジョブの実行を処理するプールに含まれるワーカーの数量。dynflowd/foreman-tasks サービスの再起動が必要です。"
      ],
      "Workers pool size": [
        "ワーカーのプールサイズ"
      ],
      "When enabled, working directories will be removed after task completion. You may override this per host by setting a parameter called remote_execution_cleanup_working_dirs.": [
        "有効にすると、作業ディレクトリーはタスクの完了後に削除されます。remote_execution_cleanup_working_dirs と呼ばれるパラメーターを設定して、ホストごとにこれを上書きすることができます。"
      ],
      "Cleanup working directories": [
        "作業ディレクトリーのクリーンアップ"
      ],
      "Where to find the Cockpit instance for the Web Console button.  By default, no button is shown.": [
        "Web コンソールボタンの Cockpit インスタンスを検索する場所。デフォルトでは、ボタンは表示されません。"
      ],
      "Cockpit URL": [
        "Cockpit URL"
      ],
      "Choose a job template that is pre-selected in job invocation form": [
        "ジョブ呼び出しフォームで事前に選択されているジョブテンプレートを選択してください"
      ],
      "Form Job Template": [
        "ジョブテンプレートの形成"
      ],
      "Select a report template used for generating a report for a particular remote execution job": [
        "特定のリモート実行ジョブのレポート生成に使用されるレポートテンプレートを選択します"
      ],
      "Job Invocation Report Template": [
        "ジョブ呼び出しレポートテンプレート"
      ],
      "Time in seconds within which the host has to pick up a job. If the job is not picked up within this limit, the job will be cancelled. Defaults to 1 day. Applies only to pull-mqtt based jobs.": [
        ""
      ],
      "Job templates": [
        "ジョブテンプレート"
      ],
      "Job invocations detail": [
        ""
      ],
      "Run Puppet Once": [
        "Puppet を 1 回実行"
      ],
      "Perform a single Puppet run": [
        "Puppet を 1 回実行"
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
        "繰り返さない"
      ],
      "Cronline": [
        "cron 行"
      ],
      "Monthly": [
        "毎月"
      ],
      "Weekly": [
        "毎週"
      ],
      "Daily": [
        "毎日"
      ],
      "Hourly": [
        "毎時"
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
        "ターゲットホストおよび入力"
      ],
      "Advanced fields": [
        "詳細フィールド"
      ],
      "Review details": [
        "詳細を確認"
      ],
      "Type of execution": [
        ""
      ],
      "Hosts": [
        "ホスト"
      ],
      "Host collections": [
        "ホストコレクション"
      ],
      "Host groups": [
        "ホストグループ"
      ],
      "Search query": [
        "検索クエリー"
      ],
      "Run job": [
        "ジョブを実行"
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
        "ジョブ説明テンプレートを編集"
      ],
      "Preview job description": [
        "ジョブ説明をプレビュー"
      ],
      "For example: 1, 2, 3, 4, 5...": [
        "たとえば、1、2、3、4、5..."
      ],
      "Interval in seconds, if the job is not picked up by a client within this interval it will be cancelled. Applies only to pull-mqtt based jobs": [
        ""
      ],
      "Key passphrase is only applicable for SSH provider. Other providers ignore this field. Passphrase is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "鍵パスフレーズは、SSH プロバイダーにのみ適用されます。他のプロバイダーは、このフィールドを無視します。パスフレーズは、ジョブが完了するまで暗号化されて DB に保存されます。将来の実行または繰り返しの実行の場合、最後の実行後に削除されます。"
      ],
      "Effective user password is only applicable for SSH provider. Other providers ignore this field. Password is stored encrypted in DB until the job finishes. For future or recurring executions, it is removed after the last execution.": [
        "実効ユーザーパスワードは、SSH プロバイダーにのみ適用されます。他のプロバイダーは、このフィールドを無視します。パスワードは、ジョブが完了するまで暗号化されて DB に保存されます。将来の実行または繰り返しの実行の場合、最後の実行後に削除されます。"
      ],
      "All fields are required.": [
        "すべてのフィールドは必須です。"
      ],
      "Error": [
        "エラー"
      ],
      "Errors:": [
        "エラー:"
      ],
      "Categories list failed with:": [
        "カテゴリー一覧が以下により失敗:"
      ],
      "Templates list failed with:": [
        "テンプレート一覧が以下により失敗:"
      ],
      "Template failed with:": [
        "テンプレートが以下により失敗:"
      ],
      "Preview Hosts": [
        "ホストのプレビュー"
      ],
      "...and %s more": [
        "...さらに %s"
      ],
      "%s more": [
        ""
      ],
      "Clear all filters": [
        ""
      ],
      "There are no available input fields for the selected template.": [
        "選択したテンプレートで使用可能な入力フィールドはありません。"
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
        "ホストでフィルター"
      ],
      "Filter by host collections": [
        "ホストコレクションでフィルター"
      ],
      "Filter by host groups": [
        "ホストグループでフィルター"
      ],
      "Apply to": [
        "適用対象"
      ],
      "Never": [
        "なし"
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
        "cron 行"
      ],
      "No Target Hosts": [
        "ターゲットホストがありません"
      ],
      "view host names": [
        ""
      ],
      "Hide all advanced fields": [
        "すべての詳細フィールドを非表示"
      ],
      "Show all advanced fields": [
        "すべての詳細フィールドを表示"
      ],
      "Schedule type": [
        "スケジュールタイプ"
      ],
      "Recurrence": [
        "繰り返し"
      ],
      "Starts at": [
        "開始時刻"
      ],
      "Starts Before": [
        ""
      ],
      "Starts": [
        "開始"
      ],
      "Now": [
        ""
      ],
      "Repeats": [
        "繰り返し"
      ],
      "Ends": [
        "終了"
      ],
      "Purpose": [
        "目的"
      ],
      "Static query": [
        "静的クエリー"
      ],
      "Dynamic query": [
        "動的クエリー"
      ],
      "Description Template": [
        "説明テンプレート"
      ],
      "A special label for tracking a recurring job. There can be only one active job with a given purpose at a time.": [
        "繰り返しジョブを追跡するための特別なラベル。特定の目的で一度にアクティブにできるジョブは 1 つだけです。"
      ],
      "Query type": [
        "クエリータイプ"
      ],
      "Type has impact on when is the query evaluated to hosts.": [
        "タイプは、ホストに対してクエリーを評価するタイミングに影響を与えます。"
      ],
      "evaluates just after you submit this form": [
        "このフォームの送信直後に評価します"
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
        "分 (範囲: 0 - 59)"
      ],
      "is hour (range: 0-23)": [
        "時間 (範囲: 0 - 23)"
      ],
      "is day of month (range: 1-31)": [
        "日 (範囲: 1 - 31)"
      ],
      "is month (range: 1-12)": [
        "月 (範囲: 1 - 12)"
      ],
      "is day of week (range: 0-6)": [
        "曜日 (範囲: 0 - 6)"
      ],
      "The cron line supports extended cron line syntax. For details please refer to the ": [
        ""
      ],
      "documentation": [
        ""
      ],
      "At": [
        "場所"
      ],
      "Invalid time format": [
        "無効な時刻の形式"
      ],
      "At minute": [
        "分"
      ],
      "range: 0-59": [
        ""
      ],
      "Create": [
        "作成"
      ],
      "Minute can only be a number between 0-59": [
        ""
      ],
      "Days": [
        "日"
      ],
      "Days of week": [
        "曜日"
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
        "次の時刻よりも前に開始"
      ],
      "End time needs to be after start time": [
        "終了時刻は開始時刻の後でなければなりません"
      ],
      "On": [
        "オン"
      ],
      "After": [
        ""
      ],
      "Repeat amount can only be a positive number": [
        "繰り返しの値は正の数でなければなりません"
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
        "無効な日付"
      ],
      "open-help-tooltip-button": [
        "open-help-tooltip-button"
      ],
      "Reset to default": [
        "デフォルトにリセット"
      ],
      "Has to be a positive number": [
        "正の数でなければなりません"
      ],
      "Please refine your search.": [
        "検索条件を見直してください。"
      ],
      "You have %s results to display. Showing first %s results": [
        "表示する結果が %s 件あります。最初の %s 件の結果を表示しています"
      ],
      "Opening job invocation form": [
        ""
      ],
      "%s job has been invoked": [
        "%s 件のジョブが呼び出されました"
      ],
      "Schedule a job": [
        "ジョブのスケジュール"
      ],
      "Recent jobs": [
        "最近のジョブ"
      ],
      "View all jobs": [
        "すべてのジョブを表示"
      ],
      "View finished jobs": [
        "完了したジョブを表示"
      ],
      "View running jobs": [
        "実行中のジョブを表示"
      ],
      "View scheduled jobs": [
        "スケジュール済みのジョブを表示"
      ],
      "Finished": [
        "終了"
      ],
      "Running": [
        "実行中"
      ],
      "Scheduled": [
        "スケジュール済み"
      ],
      "No results found": [
        "結果は見つかりませんでした"
      ],
      "Remote Execution Interface": [
        "リモート実行インターフェース"
      ],
      "yes": [
        "yes"
      ],
      "no": [
        "no"
      ],
      "Inherit from host parameter": [
        "ホストパラメーターから継承"
      ],
      "Yes (override)": [
        "Yes (上書き)"
      ],
      "No (override)": [
        "No (上書き)"
      ],
      "REX pull mode": [
        ""
      ],
      "Setup remote execution pull mode. If set to `Yes`, pull provider client will be deployed on the registered host. The inherited value is based on the `host_registration_remote_execution_pull` parameter. It can be inherited e.g. from host group, operating system, organization. When overridden, the selected value will be stored on host parameter level.": [
        ""
      ],
      "Host": [
        "ホスト"
      ],
      "Active Filters:": [
        ""
      ],
      "A plugin bringing remote execution to the Foreman, completing the config management functionality with remote management functionality.": [
        "リモート実行を Foreman で実現するプラグイン。設定管理機能にリモート管理機能を補完します。"
      ],
      "Action with sub plans": [
        "サブプランによるアクション"
      ],
      "Import Puppet classes": [
        "Puppet クラスのインポート"
      ],
      "Import facts": [
        "ファクトのインポート"
      ]
    }
  }
};