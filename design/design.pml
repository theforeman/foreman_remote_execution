@startuml

class Host {
  get_provider(type)
}

package "Job Preparation" {
  class JobTemplate {
    name: string
    job_name: string
    retry_count: integer
    retry_interval: integer
    splay: integer
    provider_type: string
    effective_user: string
    ==
    has_many :taxonomies
    has_many :inputs
    has_many :audits
  }

  class ConfigTemplateInput {
    name: string
    required: bool
    input_type: USER_INPUT | FACT | SMART_VARIABLE
    fact_name: string
    smart_variable_name: string
    description: string
    ==
    has_one :job_template
  }

  JobTemplate "1" --> "N" Taxonomy
  JobTemplate "1" --> "N" ConfigTemplateInput
  JobTemplate "1" --> "N" Audit

  class Taxonomy
  class Audit
}

package "Job Invocation" {
  class Bookmark {
    name:string
    query:string
    controller:string
    public:bool
    owner_id:integer
    owner_type:string
  }

  class Targeting {
    query: string
    dynamic: bool
  }

  class TemplateInvocation {
    inputs
  }

  class JobInvocation {
    tries
    retry_interval
    splay
    concurrency
    email_notification: bool
    effective_user: string
  }

  class User

  Bookmark "1" <-UP- "N" Targeting
  Targeting "M" -DOWN- "N" Host
  Targeting "N" -UP-> "1" User
  JobInvocation "1" -LEFT-> "1" Targeting
  JobInvocation "1" <-UP- "N" TemplateInvocation
  TemplateInvocation "N" -LEFT-> "1" JobTemplate

}

package "Scheduling" {
  class Schedule {
    start_at: datetime
    end_at: datetime
    cronline: string
  }

  JobInvocation "1" -UP- "0..1" Schedule
}

package "Execution" {
  class BulkJobTask {
    state: $TaskState
    start_at: datetime
    started_at: datetime
    ended_at datetime
    cancel()
  }

  class JobTask {
    state: $TaskState
    start_at: datetime
    started_at: datetime
    tried_count: integer
    ended_at datetime
    retry: integer
    retry_interval: integer
    timeout: integer
    splay: integer
    concurrency: integer
    provider: string

    command: string
    output: string
    exit_code: string

    {abstract} support_cancel?()
    {abstract} proxy_endpoint()
    cancel()
  }

  abstract class ProxyCommand {
  }

  class SSHProxyCommand {
    {static} support_cancel?()
    proxy_endpoint():string
  }

  class MCollectiveProxyCommand {
    {static} support_cancel?()
    proxy_endpoint():string
  }

  BulkJobTask "N" -RIGHT-> "1" JobInvocation
  BulkJobTask "1" <-- "N" JobTask
  TemplateInvocation "1" <-- "N" JobTask
  JobTask "1" -RIGHT- "1" ProxyCommand
  JobTask "1" -UP- "1" Host
}


ProxyCommand <|-- SSHProxyCommand
ProxyCommand <|-- MCollectiveProxyCommand

package "Developer API" {
  class PredefinedJob {
    predefined_job_name: string
  }

  class PredefinedJobInputMapping {
    provided_input_name: string
  }

  PredefinedJob "1" -- "N" PredefinedJobInputMapping
  PredefinedJobInputMapping "1" -RIGHT- "N" ConfigTemplateInput
  PredefinedJob "M" -RIGHT- "N" JobTemplate
}

@enduml
