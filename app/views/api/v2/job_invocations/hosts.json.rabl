collection @hosts

attribute :name, :operatingsystem_id, :operatingsystem_name, :hostgroup_id, :hostgroup_name, :id

node :job_status do |host|
  @host_statuses[host.id]
end

node :smart_proxy_id do |host|
  @smart_proxy_id[host.id]
end

node :smart_proxy_name do |host|
  @smart_proxy_name[host.id]
end

node(:task, :if => ->(_host) { @task_by_host }) do |host|
  @task_by_host[host.id]
end

node(:permissions, :if => ->(_host) { @permissions_by_host }) do |host|
  @permissions_by_host[host.id]
end
