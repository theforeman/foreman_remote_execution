@startuml
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
@enduml
