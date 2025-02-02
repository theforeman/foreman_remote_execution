class MigrateSmartProxyIdsToTemplateInvocations < ActiveRecord::Migration[6.0]
  def up
    proxy_lookup_cache = {}
    ForemanTasks::Link.joins(:task)
                      .where(resource_type: 'SmartProxy', task: { label: 'Actions::RemoteExecution::RunHostJob' })
                      .where.not(resource_id: nil)
                      .find_in_batches do |batch|
      batch.group_by(&:resource_id).each do |resource_id, links|
        proxy_lookup_cache[resource_id] = SmartProxy.where(id: resource_id).exists? unless proxy_lookup_cache.key?(resource_id)
        next unless proxy_lookup_cache[resource_id]
        template_invocation_ids = ForemanTasks::Link.where(resource_type: 'TemplateInvocation', task_id: links.map(&:task_id)).select(:resource_id)
        TemplateInvocation.where(id: template_invocation_ids).update_all(smart_proxy_id: resource_id)
      end
    end
  end

  def down
  end
end
