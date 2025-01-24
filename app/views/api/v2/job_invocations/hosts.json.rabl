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
