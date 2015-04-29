---
layout: page
title: Design
countheads: true
toc: true
comments: true
---

Remote Execution Technology
===========================

User Stories
------------

- As a user I want to run jobs in parallel across large number of
hosts

- As a user I want to run jobs on a host in a different network
  segment (the host doesn't see the Foreman server/the Foreman server
  doesn't see the host directly)

- As a user I want to manage a host without installing an agent on it
  (just plain old ssh)

- As a community user I want to already existing remote execution
  technologies in combination with the Foreman

Design
------

Although specific providers are mentioned in the design, it's used
mainly for distinguishing different approaches to the remote execution
than to choose specific technologies

### Ssh Single Host Push

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host" as Host

autonumber
User -> Foreman : JobInvocation
Foreman -> Proxy : ProxyCommand
Proxy -> Host : SshScript
Activate Host
Host --> Proxy : ProgressReport[1, Running]
Host --> Proxy : ProgressReport[2, Running]
Proxy --> Foreman : AccumulatedProgressReport[1, Running]
Host --> Proxy : ProgressReport[3, Running]
Host --> Proxy : ProgressReport[4, Finished]
Deactivate Host
Proxy --> Foreman : AccumulatedProgressReport[2, Finished]
{% endplantuml %}

JobInvocation: see see [scheduling](design#job-invocation)

ProxyCommand:

  * host: host.example.com
  * provider: ssh
  * input: "yum install -y vim-X11"

SSHScript:

  * host: host.example.com
  * input: "yum install -y vim-X11"

ProgressReport[1, Running]:

  * output: "Resolving depednencies"

ProgressReport[2, Running]:

  * output: "installing libXt"

AccumulatedProgressReport[1, Running]:

  * output: { stdout: "Resolving depednencies\ninstalling libXt" }

ProgressReport[3, Running]:

  * output: "installing vim-X11"

ProgressReport[4, Finished]:

  * output: "operation finished successfully"
  * exit_code: 0

AccumulatedProgressReport[2, Finished]:

  * output: { stdout: "installing vim-X11\noperation finished successfully", exit_code: 0 }
  * success: true

### Ssh Single Host Check-in

This case allows to handle the case, when the host is offline by the
time of job invocation: the list of jobs for the host is stored on the
Foreman server side for running once the host is online.

This approach is not limited to the ssh provider only.

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host" as Host

autonumber
User -> Foreman : JobInvocation
Host -> Proxy : CheckIn
Proxy -> Foreman : CheckIn
Foreman -> Proxy : ProxyCommand
Proxy -> Host : SshScript
{% endplantuml %}

### Ssh Multi Host

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host 1" as Host1
participant "Host 2" as Host2

autonumber
User -> Foreman : JobInvocation
Foreman -> Proxy : ProxyCommand[host1]
Foreman -> Proxy : ProxyCommand[host2]
Proxy -> Host1 : SSHScript
Proxy -> Host2 : SSHScript
{% endplantuml %}

ProxyCommand[host1]:

  * host: host-1.example.com
  * provider: ssh
  * input: "yum install -y vim-X11"

ProxyCommand[host2]:

  * host: host-2.example.com
  * provider: ssh
  * input: "yum install -y vim-X11"

{% info_block %}
we might want to optimize the communication between server and
the proxy (sending collection of ProxyCommands in bulk, as well as
the AccumulatedProgerssReports). That would could also be utilized
by the Ansible implementation, where there might be optimization
on the invoking the ansible commands at once (the same might apply
to mcollective). On the other hand, this is more an optimization,
not required to be implemented from the day one: but it's good to have
this in mind
{% endinfo_block %}

### MCollective Single Host

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "AMQP" as AMQP
participant "Host" as Host

autonumber
User -> Foreman : JobInvocation
Foreman -> Proxy : ProxyCommand
Proxy -> AMQP : MCOCommand
AMQP -> Host : MCOCommand
Activate Host
Host --> AMQP : ProgressReport[Finished]
Deactivate Host
AMQP --> Proxy : ProgressReport[Finished]
Proxy --> Foreman : AccumulatedProgressReport[Finished]
{% endplantuml %}

JobInvocation:

  * hosts: [host.example.com]
  * template: install-packages-mco
  * input: { packages: ['vim-X11'] }

ProxyCommand:

  * host: host.example.com
  * provider: mcollective
  * input: { agent: package, args: { package => 'vim-X11' } }

MCOCommand:

  * host: host.example.com
  * input: { agent: package, args: { package => 'vim-X11' } }

ProgressReport[Finished]:

  * output: [ {"name":"vim-X11","tries":1,"version":"7.4.160-1","status":0,"release":"1.el7"},
              {"name":"libXt","tries":1,"version":"1.1.4-6","status":0,"release":"1.el7"} ]

AccumulatedProgressReport[Finished]:

  * output: [ {"name":"vim-X11","tries":1,"version":"7.4.160-1","status":0,"release":"1.el7"},
              {"name":"libXt","tries":1,"version":"1.1.4-6","status":0,"release":"1.el7"} ]
  * success: true

### Ansible Single Host

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host" as Host

autonumber
User -> Foreman : JobInvocation
Foreman -> Proxy : ProxyCommand
Proxy -> Host : AnsibleCommand
Activate Host
Host --> Proxy : ProgressReport[Finished]
Deactivate Host
Proxy --> Foreman : AccumulatedProgressReport[Finished]

{% endplantuml %}

JobInvocation:

  * hosts: [host.example.com]
  * template: install-packages-ansible
  * input: { packages: ['vim-X11'] }

ProxyCommand:

  * host: host.example.com
  * provider: ansible
  * input: { module: yum, args: { name: 'vim-X11', state: installed } }

AnsibleCommand:

  * host: host.example.com
  * provider: ansible
  * input: { module: yum, args: { name: 'vim-X11', state: installed } }

ProgressReport[Finished]:

  * output: { changed: true,
              rc: 0,
              results: ["Resolving depednencies\ninstalling libXt\ninstalling vim-X11\noperation finished successfully"] }

AccumulatedProgressReport[Finished]:

  * output: { changed: true,
              rc: 0,
              results: ["Resolving depednencies\ninstalling libXt\ninstalling vim-X11\noperation finished successfully"] }
  * success: true


Job Preparation
===============

User Stories
------------

- As a user I want to be able to create a template to run some command for a given remote execution provider for a specific job

- As a user these job templates should be audited and versioned

- As a user I want to be able to define inputs into the template that consist of user input at execution time.  I should be able to use these inputs within my template.

- As a user I want to be able to define an input for a template that uses a particular fact about the host being executed on at execution time.

- As a user I want to be able to define an input for a template that uses a particular smart variable that is resolved at execution time.

- As a user I want to be able to define a description of each input in order to help describe the format and meaning of an input.

- As a user I want to be able to specify default number of tries per job template.

- As a user I want to be able to specify default retry interval per job template.

- As a user I want to be able to specify default splay time per job template.

- As a user I want to setup default timeout per job template.

- As a user I want to preview a rendered job template for a host (providing needed inputs)

Scenarios
---------
**Creating a job template**

1. given I'm on new template form
1. I select from a list of existing job names or fill in a new job name
1. I select some option to add an input
  1. Give the input a name
  1. Select the type 'user input'
  1. Give the input a description (space separated package list)
1. I select from a list of known providers (ssh, mco, salt, ansible)
1. I am shown an example of how to use the input in the template
1. I am able to see some simple example for the selected provider??
1. I fill in the template
1. I select one or more organizations and locations (if enabled)
1. I click save


**Creating a smart variable based input**

1. given i am creating or editing a job template
1. I select to add a new input
  1. Give the input a name
  1. Define a smart variable name

Design
------

{% plantuml %}

class JobTemplate {
  name:string
  job_name: string
  retry_count: integer
  retry_interval: integer
  splay: integer
  provider_type: string
  ==
  has_and_belongs_to_many :taxonomies
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

ConfigTemplate "1" -- "N" ConfigTemplateInput
{% endplantuml %}


Job Invocation
==============

User Stories
------------

- As a user I would like to invoke a job on a single host

- As a user I would like to invoke a job on a set of hosts, based on
  search filter

- As a user I want to be able to reuse existing bookmarks for job
  invocation

- As a user, when setting a job in future, I want to decide if the
  search criteria should be evaluated now or on the execution time

- As a user I want to reuse the target of previous jobs for next execution

- As a CLI user I want to be able to invoke a job via hammer CLI

- As a user, I want to be able to invoke the job on a specific set of hosts
  (by using checkboxes in the hosts table)

- As a user, when planning future job execution, I want to see a
  warning with the info about unreachable hosts

- As a user I want to be able to override default values like (number
  of tries, retry interval, splay time, timeout, effective user...) when I plan an execution of command.

- As a user I expect to see a the description of an input whenever i am being requested to
  provide the value for the input.

- As a user I want to be able to re-invoke the jobs based on
  success/failure of previous task

Scenarios
---------

**Fill in target for a job**

1. when I'm on job invocation form
1. then I can specify the target of the job using the scoped search
syntax
1. the target might influence the list of providers available for the
invocation: although, in delayed execution and dynamic targeting the
current list of providers based on the hosts might not be final and
we should count on that.

**Fill in template inputs for a job**

1. given I'm on job invocation form
1. when I choose the job to execute
1. then I'm given a list of providers that I have enabled and has a
template available for the job
1. and each provider allows to choose which template to use for this
invocation (if more templates for the job and provider are available)
1. and every template has input fields generated based on the input
defined on the template (such as list of packages for install package
job)

**See the calculated template inputs for a job**

1. given I'm on job invocation form
1. when I choose the job to execute
1. and I'm using a template with inputs calculated base on fact  data
template available for the job
1. then the preview of the current value for this input should be displayed
1. but for the execution the value that the fact has by the time of
execution will be used.

**Fill in job description for the execution**

1. given I'm on job invocation form
1. there should be a field for task description, that will be used for
listing the jobs
1. the description value should be pregenerated based on the job name
and specified input (something like "Package install: zsh")

**Fill in execution properties of the job**

1. when I'm on job invocation form
1. I can override the default values for number of tries, retry
  interval, splay time, timeout, effective user...
1. the overrides are common for all the templates

**Set the execution time into future** (see [scheduling](design#scheduling)
  for more scenarios)

1. when I'm on a job invocation form
1. then I can specify the time to start the execution at (now by
default)
1. and I can specify if the targeting should be calculated now or
postponed to the execution time

**Run a job from host detail**

1. given I'm on a host details page
1. when I click "Run job"
1. then a user dialog opens with job invocation form, with pre-filled
targeting pointing to this particular host

**Run a job from host index**

1. given I'm on a host index page
1. when I click "Run job"
1. then a user dialog opens with job invocation form, with prefiled
targeting using the same search that was used in the host index page

**Invoke a job with single remote execution provider**

1. given I have only one provider available in my installation
1. and I'm on job invocation form
1. when I choose the job to execute
1. then only the template for this provider is available to run and
asking for user inputs

**Invoke a job with hammer**

1. given I'm using CLI
1. then I can run a job with ability to specify:
  - targeting with scoped search or bookmark_id
  - job name to run
  - templates to use for the job
  - inputs on per-template basis
  - execution properties as overrides for the defaults coming from the template
  - ``start_at`` value for execution in future
  - in case of the start_at value, if the targeting should be static
    vs. dynamic
  - whether to wait for the job or exit after invocation (--async
    option)

**Re-invoke a job**

1. given I'm in job details page
1. when I choose re-run
1. then a user dialog opens with job invocation form, with prefiled
targeting parameters from the previous execution
1 and I can override all the values (including targeting, job,
templates and inputs)

**Re-invoke a job for failed hosts**

1. given I'm in job details page
1. when I choose re-run
1. then a user dialog opens with job invocation form, with prefiled
targeting parameters from the previous execution
1 and I can override all the values (including targeting, job,
templates and inputs)
1. I can choose in the targeting to only run on hosts that failed with
the job previously

**Edit a bookmark referenced by pending job invocation**

1. given I have a pending execution task which targeting was created
from a bookmark
2. when I edit the bookmark
3. then I should be notified about the existence of the pending tasks
with ability to update the targeting (or cancel and recreate the
invocation)

**Email notification: opt in**

1. given I haven't configured to send email notifications about my executions
1. then the job invocation should have the 'send email notification'
turned off by default

**Email notification: opt out**

1. given I haven't configured to send email notifications about my executions
1. then the job invocation should have the 'send email notification'
turned off by default

Design
------

Class diagram of Foreman classes

{% plantuml %}

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

class Host
class User

class TemplateInvocation {
  inputs
}

class JobInvocation {
  tries
  retry_interval
  splay
  concurrency
  effective_user
  email_notification: bool
}

class JobTask {
  start_at: datetime
}

Bookmark "1" - "N" Targeting
Targeting "M" - "N" Host : (polymorphic)
Targeting "N" -- "1" User
JobInvocation "1" -- "1" Targeting
JobInvocation "1" -- "N" TemplateInvocation
TemplateInvocation "N" -- "1" JobTemplate
JobInvocation "1" -- "N" JobTask

{% endplantuml %}

Query is copied to Targeting, we don't want to propagate any later
changes to Bookmark to already planned job executions.

We can store link to original bookmark to be able to
compare changes later.

For JobInvocation we forbid later editing of Targeting.

Open questions
--------------

* should we unify the common inputs in all templates to specify them
only once or scoping the input by template?

* Maybe an inputs catalog (with both defined name and semantic) might
help with keeping the inputs consistent across templates/providers


Job Execution
=============

User Stories
------------

- As a user I want to be able to cancel job which hasn't been started yet.

- As a user I want to be able to cancel job which is in progress
  (if supported by specific provider…)

- As a user I want job execution to fail after timeout limit.

- As a user I want to job execution to be re-tried
  based on the tries and retry interval values given in the invocation

- As a user I want to job execution on multiple hosts to be spread
  using the splay time value: the execution of the jobs will be spread
  randomly across the time interval

- As a user I want to job execution on multiple hosts to be limited
  by a concurrency level: the number of concurrently running jobs will
  not exceed the limit.

- As a user I want the job execution to be performed as a user that
  was specified on the job invocation

- As a user I want an ability to retry the job execution when the host
  checks in (support of hosts that are offline by the time the
  execution).

Scenarios
---------

**Cancel pending bulk task: all at once**

1. given I've set a job to run in future on multiple hosts
1. when I click 'cancel' on the corresponding bulk task
1. then the whole task should be canceled (including all the sub-tasks
on all the hosts)

**Cancel pending bulk task: task on specific host**

1. given I've set a job to run in future on multiple hosts
1. when I show the task representation on a host details page
1. when I click 'cancel' on the task
1. then I should be offered whether I should cancel just this
instance or the whole bulk task on all hosts

**Fail after timeout**

1. given I've invoked a job
1. when the job fails to start in given specified timeout
1. then the job should be marked as failed due to timeout

**Retried task**

1. given I've invoked a job
1. when the job fails to start at first attemt
1. then the executor should wait for retry_timeout period
1. and it should reiterate with the attempt based on the tries number
1. and I should see the information about the number of retries

Design
------

Class diagram for jobs running on multiple hosts

{% plantuml %}


class Host {
  get_provider(type)
}

class BulkJobTask {
  state: $TaskState
  start_at: datetime
  started_at: datetime
  ended_at datetime
  cancel()
}

class JobTask {
  retry: integer
  retry_interval: integer
  timeout: integer
  splay: integer
  concurrency: integer
  type: string
  state: $TaskState
  start_at: datetime
  started_at: datetime
  tried_count: integer
  ended_at datetime
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

BulkJobTask "N" - "1" JobInvocation
BulkJobTask "1" -- "N" JobTask
TemplateInvocation "N" - "1" JobInvocation
TemplateInvocation "1" --- "N" JobTask
JobTask "1" -- "1" ProxyCommand
JobTask "N" -- "1" Host

ProxyCommand <|-- SSHProxyCommand
ProxyCommand <|-- MCollectiveProxyCommand

{% endplantuml %}

Class diagram for jobs running a single host

{% plantuml %}

class Host {
  get_provider(type)
}

class JobTask {
  retry: integer
  retry_interval: integer
  timeout: integer
  splay: integer
  concurrency: integer
  type: string
  state: $TaskState
  started_at: datetime
  start_at: datetime
  tried_count: integer
  ended_at datetime
  cancel()
  {abstract} support_cancel?()
  {abstract} proxy_endpoint()
  plan()
  cancel()
}

class ProxyCommand {
}

JobTask "N" - "1" JobInvocation
TemplateInvocation "N" - "1" JobInvocation
TemplateInvocation "1" - "N" JobTask
JobTask "1" -- "1" ProxyCommand
JobTask "1" -- "1" Host
{% endplantuml %}

Reporting
=========

User Stories
------------

- As a user I would like to monitor the current state of the job
  running against a single host, including the output and exit status

- As a user I would like to monitor the status of bulk job,
  including the number of successful, failed and pending tasks

- As a user I would like to see the history of all job run on a
  host

- As a user I would like to see the history of all tasks that I've
  invoked

- As a user I would like to be able to  get an email notification with
  execution report

Scenarios
---------

**Track the job running on a set of hosts**

1. given I've set a job to run in future on multiple hosts
1. then I can watch the progress of the job (number of
successful/failed/pending tasks)
1. and I can get to the list of jobs per host
1. and I'm able to filter on the host that it was run against and
state

**Track the job running on a single host**

1. given I've set a job to run on a specific host
1. when I show the task representation page
1. then I can watch the progress of the job (updated log), status

**History of jobs run on a host**

1. given I'm on host jobs page
1. when I can see all the jobs run against the host
1. and I'm able to filter on the host that it was run against and
state, owner etc.

**History of invoked jobs**

1. given I'm on job invocation history page
1. when I can see all the jobs invoked in the system
1. scoped by a taxonomy (based on the hosts the jobs were run against)
1. and I'm able to filter on the host that it was run against and
state, owner etc.

**Email notification: send after finish**

1. given I've invoked a job with email notification turned on
1. when the job finishes
1. then I should get the email with report from the job after it finishes

Design
------

Class diagram for jobs running on multiple hosts

{% plantuml %}


class Host {
}

class JobInvocation {
  email_notification: bool
}

class BulkJobTask {
  state: $TaskState
  start_at: datetime
  started_at: datetime
  ended_at datetime
}

class JobTask {
  type: string
  state: $TaskState
  start_at: datetime
  started_at: datetime
  ended_at datetime
  tried_count: integer
  command: string
  output: string
  exit_code: string
}

BulkJobTask "N" - "1" JobInvocation
BulkJobTask "1" -- "N" JobTask
JobTask "1" -- "1" Host

{% endplantuml %}

Scheduling
==========

User Stories
------------

- As a user I want to be able go execute a job at future time

- As a user I want to set the job to reoccur with specified
  frequency

Scenarios
---------

**Job set for the future**

1. given I've invoked a job at future time
1. when the time comes
1. the job gets executed

**Creating reoccurring job**

1. given I'm in job invocation form
1. when I check 'reoccurring job'
1. then I can set the frequency and valid until date

**Showing the tasks with reoccurring logic**

1. when I list the jobs
1. I can see the information about the reoccurring logic at every job
1. and I can filter the jobs for those with the reoccurring logic

**Canceling the reoccurring job**

1. given I have reoccurring job configured
1. when I cancel the next instance of the job
1. then I'm offered to cancel the reoccurring of the job in the future

Design
------

{% plantuml %}

class Schedule {
  start_at: datetime
  end_at: datetime
  cronline: string
}

class JobTask {
}

JobTask "N" -- "1" JobInvocation
JobInvocation "1" -- "1" Schedule

{% endplantuml %}

Developer API
=============

User Stories
------------

- As a Foreman developer, I want to be able to use remote execution
  plugin to help with other Foreman features such as:
  - puppet run
  - grubby reprovision
  - content actions (package install/update/remove/downgrade, group
    install/uninstall, package profile refresh)
  - subscription actions (refresh)
  - OpenSCAP content update

Scenarios
---------

**Defining a predefined job without provided inputs**

1. given I'm a Foreman developer
1. and I want to expose 'puppet run' feature to the user
1. then define the 'Puppet Run' as predefined job in the code
1. and specify the default job name to be used for the mapping

**Defining a predefined job with provided inputs**

1. given I'm a Katello developer
1. and I want to expose 'package install' feature to the user
1. then I define the 'Package Install' predefined job with list of
packages as provided input in the code
1. and I specify default job name to be used for the mapping
1. and I specify default mapping of the provided inputs to template
inputs

**Preseeding the predefined jobs**

1. given I've defined the 'Package Install' predefined job
1. when the seed script is run as part of the Foreman installation
1. the systems tries to create the default mapping from the predefined job to
the existing templates based on the developer-provided defaults

**Configuring the predefined jobs mapping**

1. given I'm the administrator of the Foreman instance
1. then I can see all the predefined jobs mapping
1. when I edit existing mapping
1. then I can choose job name, template and provided input -> template
inputs mapping

**Configuring the predefined jobs mapping with organizations**

1. given I'm the administrator of the Foreman instance
1. then I can scope the mapping of the predefined job to a specific
organization
1. and the system doesn't let me to create two mappings for the same
 predefined job and provider visible in one organization

**Using the predefined jobs without provided inputs**

1. given I'm a Foreman user
1. when I'm on host details page
1. and I press 'Puppet Run'
1. the job is invoked on the host based on the predefined mapping

**Using the predefined jobs with provided inputs**

1. given I'm a Katello user
1. when I'm on host applicable errata list
1. and I select a set of errata to install on the host
1. and I click 'Install errata'
1. the job will be invoked to install the packages belonging to this
errata

**Using the predefined jobs with customization**

1. given I'm a Katello user
1. when I'm on host applicable errata list
1. and I select a set of errata to install on the host
1. and I click 'Install errata (customize)'
1. then the job invocation form will be opened with pre-filled values
 based on the mapping
1. and I can update the values, including setting the start_at time or
 reoccurring logic

Design
------

{% plantuml %}

class PredefinedJob {
  predefined_job_name: string
  ==
  has_and_belongs_to_many :taxonomies
}

class PredefinedJobInputMapping {
  provided_input_name: string
}

PredefinedJob "1" -- "N" PredefinedJobInputMapping
PredefinedJobInputMapping "N" -- "1" ConfigTemplateInput
PredefinedJob "M" -- "N" JobTemplate
note on link #red: 1:1 per organization and provider

{% endplantuml %}


Security
========

User Stories
------------

- As a user I want to be able to plan job invocation for any host that I
  can view (view_host permission).

- As a user I want to be able to plan a job invocation of job that I can 
  view (view_job permission)

- As a user I want to restrict other users which combination of host and job 
  name they can execute (execute permission on job_task resource).
 
- As a user I want to be warned if I planned job invocation on hosts on
  which the execution of this job is not allowed to me.

- As a user I want to see refused job invocations (based on permissions) as
  failed when they are executed.

- As a user I want to set limit filter with execute permission by host attributes
  such as hostgroup, environment, fqdn, id, lifecycle environment (if applicable), 
  content view (if applicable).
  
- As a user I want to specify effective_user for JobInvocation if at least one
  provider supports it.

- As a user I want to restrict other users to execute job under specific user
  as a part of filter condition. If the provider does not allow this, execution
  should be refused.

- As a job template provider I want to be able to specify default effective user
  
Scenarios
---------

**Allow user A to invoke package installation on host B**

1. given  user A can view all hosts and job templates
1. when he invoke package installation job on host B
1. then his job task fails because he does not have execution 
   permission for such job task

**Allow user A to run package installation on host B**

1. given I've permissions to assign other user permissions
1. and user A can view all hosts and job templates
1. and user A can create job invocations
1. when I grant user A execution permission on resource JobTask
1. and I set related filter condition to "host_name = B and job_name = package_install"
1. and user A invokes package install execution on hosts B and C
1. then the job gets executed successfully on host B
1. and job execution will fail on host C

**User can set effective user**

1. given the provider of job template supports changing effective user
1. when user invokes a job
1. then he can set effective user under which job is executed on target host
 
**User can disallow running job as different effective user**

1. given I've permissions to assign other user permissions
1. and user A can view all hosts and job templates
1. and user A can create job invocations
1. when I grant user A execution permission on resource JobTask
1. and I set related filter condition to "effective_user = user_a"
1. and user A invokes job execution with effective user set to different user (e.g. root)
1. then the job execution fails

New permissions introduced
--------------------------

- JobInvocation
  - Create
  - View
  - Cancel
  - Edit (Schedule, never can change targetting)
- JobTask
  - Execute
  - (filter can be: effective_user = 'joe' and host_id = 1 or host_id = 2 and script_name = 'foobar')


Design
------

{% plantuml %}

class JobTemplate {
  effective_user: string
}

class JobInvocation {
  effective_user: string
}

{% endplantuml %}

Katello Client Utilities
========================

Design
------

katello-agent provides three main functions aside from remote management:

* package profile yum plugin - pushes a new package profile after any yum transaction
  * Split out into its own package (yum-plugin-katello-profile)
* enabled repository monitoring
  * monitors /etc/yum.repos.d/redhat.repo file for changes and sends newly enabled repos whenever it does change
  * Split out into its own package (katello-errata-profile) with a service to do the same
* On the capsule, goferd runs to recieve commands to sync repositories, possible solutions:
  * katello-agent can remain (but possibly renamed), with a lot of the existing functionality removed
  * pulp changes to a rest api method for initiating capsule syncs, katello needs to store some auth credentials per capsule

Orchestration
=============

User Stories
------------

- As a user I want to group a number of jobs together and treat them
as an executable unit. (i.e. run this script to stop the app, install
these errata, reboot the system)

- As a user I want to run a set of jobs in a rolling fashion.
  (i.e.,patch server 1, reboot it, if it succeeds, proceed to server 2
  & repeat. Otherwise raise exception)

- As a user I want to define a rollback job in case the execution
  fails

- As a sysadmin I would like to orchestrate several actions across a
  collection of machines. (e.g. install a DB on this machine, and pass
  the ip address into an install of a web server on another machine)

Design
------

- TBD after the simple support is implemented, possible cooperation with
multi-host deployments feature

- Some of the features might be solved by advanced remote execution
  technology integration (such as ansible playbook)


Design: the whole picture
======================

{% plantuml %}
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
    has_and_belongs_to_many :taxonomies
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

  JobTemplate "1" -- "N" ConfigTemplateInput
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

  Bookmark "1" -DOWN- "N" Targeting
  Targeting "M" -DOWN- "N" Host
  Targeting "N" -UP- "1" User
  JobInvocation "1" -LEFT- "1" Targeting
  JobInvocation "1" -DOWN- "N" TemplateInvocation
  TemplateInvocation "N" -LEFT- "1" JobTemplate

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

  BulkJobTask "N" -LEFT- "1" JobInvocation
  BulkJobTask "1" -- "N" JobTask
  TemplateInvocation "1" -- "N" JobTask
  JobTask "1" -RIGHT- "1" ProxyCommand
  JobTask "N" -UP- "1" Host
}


ProxyCommand <|-- SSHProxyCommand
ProxyCommand <|-- MCollectiveProxyCommand

package "Developer API" {
  class PredefinedJob {
    predefined_job_name: string
    ==
    has_and_belongs_to_many :taxonomies
  }

  class PredefinedJobInputMapping {
    provided_input_name: string
  }

  PredefinedJob "1" -- "N" PredefinedJobInputMapping
  PredefinedJobInputMapping "N" -RIGHT- "1" ConfigTemplateInput
  PredefinedJob "M" -RIGHT- "N" JobTemplate
}

{% endplantuml %}
