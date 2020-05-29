module ForemanRemoteExecution
  module Orchestration::SSH
    extend ActiveSupport::Concern

    included do
      before_destroy :ssh_destroy
      after_validation :queue_ssh_destroy
      register_rebuild(:queue_ssh_destroy, N_("SSH_#{self.to_s.split('::').first}"))
    end

    def drop_from_known_hosts(proxy_id)
      _, _, target = host_kind_target
      return true if target.nil?

      proxy = ::SmartProxy.find(proxy_id)
      begin
        proxy.drop_host_from_known_hosts(target)
      rescue RestClient::ResourceNotFound => e
        # ignore 404 when known_hosts entry is missing or the module was not enabled
        Foreman::Logging.exception "Proxy failed to delete SSH known_hosts for #{name}, #{ip}", e, :level => :error
      rescue => e
        Rails.logger.warn e.message
        return false
      end
      true
    end

    def ssh_destroy
      logger.debug "Scheduling SSH known_hosts cleanup"

      host, _kind, _target = host_kind_target
      proxies = host.remote_execution_proxies('SSH').values
      proxies.flatten.uniq.each do |proxy|
        queue.create(id: queue_id(proxy.id), name: _("Remove SSH known hosts for %s") % self,
          priority: 200, action: [self, :drop_from_known_hosts, proxy.id])
      end
    end

    def queue_ssh_destroy
      should_drop_from_known_hosts? && ssh_destroy
    end

    def should_drop_from_known_hosts?
      host, = host_kind_target
      host && !host.new_record? && host.build && host.changes.key?('build')
    end

    private

    def host_kind_target
      if self.is_a?(::Host::Base)
        [self, 'host', name]
      else
        [self.host, 'interface', ip]
      end
    end

    def queue_id(proxy_id)
      _, kind, id = host_kind_target
      "ssh_remove_known_hosts_#{kind}_#{id}_#{proxy_id}"
    end
  end
end
