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

- As a user I want to run commands in parallel across large number of
hosts

- As a user I want to run commands on a host in a different network
  segment (the host doesn't see the Foreman server/the Foreman server
  doesn't see the host directly)

- As a user I want to manage a host without installing an agent on it
  (just plain old ssh)

- As a community user I want to already existing remote execution
  technologies in combination with the Foreman

Design
------

### Ssh Single Host Push

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host" as Host

autonumber
User -> Foreman : UserCommand
Foreman -> Proxy : ProxyCommand
Proxy -> Host : SshCommand
Activate Host
Host --> Proxy : ProgressReport[1, Running]
Host --> Proxy : ProgressReport[2, Running]
Proxy --> Foreman : AccumulatedProgressReport[1, Running]
Host --> Proxy : ProgressReport[3, Running]
Host --> Proxy : ProgressReport[4, Finished]
Deactivate Host
Proxy --> Foreman : AccumulatedProgressReport[2, Finished]
{% endplantuml %}

UserCommand:

  * hosts: [host.example.com]
  * template: install-packages-ssh
  * input: { packages: ['vim-X11'] }

ProxyCommand:

  * host: host.example.com
  * provider: ssh
  * input: "yum install -y vim-X11"

SshCommand:

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

### Ssh Single Host Pull

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host" as Host

autonumber
User -> Foreman : UserCommand
group Optional
  Foreman -> Proxy : EnforceCheckIn
  Proxy -> Host : EnforceCheckIn
end
Host -> Proxy : CheckIn
Proxy -> Foreman : CheckIn
Foreman --> Proxy : ProxyCommand
Proxy --> Host : Script
Activate Host
Host -> Proxy : ProgressReport[1, Running]
Host -> Proxy : ProgressReport[2, Running]
Proxy -> Foreman : AccumulatedProgressReport[1, Running]
Host -> Proxy : ProgressReport[3, Running]
Host -> Proxy : ProgressReport[4, Finished]
Deactivate Host
Proxy -> Foreman : AccumulatedProgressReport[2, Finished]
{% endplantuml %}

UserCommand:

  * hosts: [host.example.com]
  * template: install-packages-ssh
  * input: { packages: ['vim-X11'] }

ProxyCommand:

  * host: host.example.com
  * provider: ssh
  * input: "yum install -y vim-X11"

Script:

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

  * output: { stdout: "Resolving depednencies\ninstalling libXt", exit_code: 0 }
  * success: true

### Ssh Multi Host

{% plantuml %}
actor User
participant "Foreman Server" as Foreman
participant "Foreman Proxy" as Proxy
participant "Host 1" as Host1
participant "Host 2" as Host2

autonumber
User -> Foreman : UserCommand
Foreman -> Proxy : ProxyCommand[host1]
Foreman -> Proxy : ProxyCommand[host2]
Proxy -> Host1 : SshCommand
Proxy -> Host2 : SshCommand
{% endplantuml %}

UserCommand:

  * hosts: *.example.com
  * template: install-packages-ssh
  * input: { packages: ['vim-X11'] }

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
User -> Foreman : UserCommand
Foreman -> Proxy : ProxyCommand
Proxy -> AMQP : MCOCommand
AMQP -> Host : MCOCommand
Activate Host
Host --> AMQP : ProgressReport[Finished]
Deactivate Host
AMQP --> Proxy : ProgressReport[Finished]
Proxy --> Foreman : AccumulatedProgressReport[Finished]
{% endplantuml %}

UserCommand:

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
User -> Foreman : UserCommand
Foreman -> Proxy : ProxyCommand
Proxy -> Host : AnsibleCommand
Activate Host
Host --> Proxy : ProgressReport[Finished]
Deactivate Host
Proxy --> Foreman : AccumulatedProgressReport[Finished]

{% endplantuml %}

UserCommand:

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


Command Preparation
===================

User Stories
------------

- ?As a user I want to be able to specify default number of tries per command. # Command preparation?

- ?As a user I want to be able to specify default retry interval per command. # Command preparation?

- ?As a user I want to be able to specify default splay time per command. # Command preparation?

- ?As a user I want to setup default timeout per command. # Command preparation?


Design
------

{% plantuml %}

class ConfigTemplate {
  name:string
  template: string
  job_name: string
  retry_count: integer
  retry_interval: integer
  splay: integer
  provider_type: string
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
  ==
  has_one :command_template
}


class ProxyCommand {
  rendered_template: string
  ==
  has_one :config_template
  has_one :audit
  has_one :host
}


ConfigTemplate -* Taxonomy
ConfigTemplate -* ConfigTemplateInput
ConfigTemplate -* Audit
ProxyCommand -> ConfigTemplate
ProxyCommand -> Audit

class Taxonomy
class Audit

{% endplantuml %}


Command Invocation
===================

User Stories
------------

- As a user when I plan a new CommandExecution I want to use an existing bookmark for specifying target hosts

- As a user when I plan a new CommandExecution I want to use custom scoped search syntax for specifying target hosts

- As a user when I plan a new CommandExecution I want to target single host

- As a user when I plan a new CommandExecution I want to be able to evaluate a search query to target host immediately and store this list of targets even if command is planed in future

- As a user when I plan a new CommandExecution I want to be able to evaluate a search query just before execution starts, if it's recurring I want new evaluation before every start

- As a user when I plan a new CommandExecution I want planning functionality exposed by API and available in hammer

- As a user I want to reuse targets of existing CommandExecution

- As a user I want to have UI to add specific hosts to bookmarks so I don't have to specify scoped search for it (like fqdn = a or id = 1) [low priority]

- As a user when I plan a new CommandExecution I want to see a warning based on status of targeted hosts (unavailable/not checking in)

- As a user I want to be able to override default values like (number of tries, retry interval, splay time, ...) when I plan an execution of command.

- As a user I want to be able to specify infinite number of tries (until success/cancel) when I plan an execution of command.

- As a user I want to set timeout when I plan an execution of a command.

- As a user I want to override default timeout when I plan an execution of command.

Scenarios
---------

[ convert this to text descriptions ]

- As a user to plan a command I want to: 
  input a job name
  select targets (based on bookmarks, explicit host selection, custom query)
  select job templates that can be used for this job name and targets (host is responsible to pick the one from the list)
  fill in inputs for the selected job templates

- As a user I want a link in host detail page to execute a job on displayed host which pre-fills the target in command invocation form

- As a user I want a link in host list page that redirects me to command invocation page where I can plan job execution for targets I saw on host list page


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

note top of Targeting: author id changes every time\n when Targeting is touched
class Targeting {
  bookmark_id: integer
  query: string
  dynamic: bool
  author_id: integer
  ==
  has_many :targets
  has_one :command_execution
}

class Host
class User

class JobExecution {
  target: n:m to host_groups/bookmarks/hosts
  input: $input_abstraction values clone

  state: $JobState
  started_at: datetime
  canceled_at datetime
  provider: SSH | MCollective

  retry: integer
  retry_interval: integer
  timeout: integer
  splay: integer

  targeting_id: integer

  cancel()
}

Bookmark <- Targeting
Targeting <-> Host : polymorphic
Targeting --> User
JobExecution --> Targeting

{% endplantuml %}

Query is copied to Target, we don't want to propagate any later
changes to Bookmark to already planned job executions.

We can store link to original bookmark to be able to
compare changes later.

For JobExecution we forbid later editing of Targeting.


Command Execution
=================

User Stories
------------

- As a user I want to be able to cancel command which hasn't been started yet.

- As a user I want to be able to cancel command which is in progress. # some providers might not support this? therefore next user stories

- As a developer I want to specify whether cancellation of running commands is possible.

- As a user I want to see if I'm able to cancel the command.

- As a user I want job execution to fail after timeout limit.

Design
------

Class diagram of Foreman classes

{% plantuml %}

class JobTemplate {
  InstallPackage, Exec, RestartService

  // default values for job template
  retry: integer
  retry_interval: integer
  timeout: integer
  splay: integer

  plan(target, input) - creates JobExecution
}
note top of JobTemplate: InstallPackage, Exec, Restart service\nare just example names of instances\nwill be covered in JobPreparation design

class Host {
  get_provider(type)
}

class JobExecution {
  target: n:m to host_groups/bookmarks/hosts
  input: $input_abstraction values clone

  state: $JobState
  started_at: datetime
  canceled_at datetime
  provider: SSH | MCollective

  retry: integer
  retry_interval: integer
  timeout: integer
  splay: integer

  targeting_id: integer

  cancel()
}

abstract class ProxyCommand {
  job_execution_id: integer
  host_id: integer
  type: string
  state: $JobState
  started_at: datetime
  canceled_at datetime
  timeout_at datetime
  tried_count: integer
  cancel()
  {abstract} support_cancel?()
  {abstract} proxy_endpoint()
  plan()
}

class SSHProxyCommand {
  {static} support_cancel?()
  proxy_endpoint():string
}

class MCollectiveProxyCommand {
  {static} support_cancel?()
  proxy_endpoint():string
}

enum JobState {
PLANNED
STARTED
FINISHED
}

JobTemplate - JobExecution : n:m
JobExecution <-- ProxyCommand
Host <-- ProxyCommand

ProxyCommand <|-- SSHProxyCommand
ProxyCommand <|-- MCollectiveProxyCommand

{% endplantuml %}

JobExecution will be probably later replaced by Scheduler that
will schedule ProxyCommands (could be responsible for batch jobs,
retrying on failure, timeouts)

We should take facts from Foreman rather gather them during runtime (different result than expected when planning, performance)

Open questions
--------------


Reporting
=========

User Stories
------------

Design
------

Scheduling
==========

User Stories
------------

Design
------

Katello Workflow Integration
============================

User Stories
------------

Design
------

Security
========

User Stories
------------

Design
------

Orchestration
=============

User Stories
------------

Design
------
