object @template_invocation

attributes :id, :template_id, :job_invocation_id, :effective_user, :host_id, :run_host_job_task_id

node(:host_name) { |ti| ti.host.name }
node(:smart_proxy) do |ti|
  {
    id: ti.smart_proxy&.id,
    name: ti.smart_proxy&.name,
  }
end
