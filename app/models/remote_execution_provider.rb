class RemoteExecutionProvider
  class << self
    def provider_for(type)
      providers[type.to_s] || providers[:Ssh]
    end

    def providers
      @providers ||= { }.with_indifferent_access
    end

    def register(key, klass)
      providers[key.to_sym] = klass
    end

    def provider_names
      providers.keys.map(&:to_s)
    end

    def proxy_command_options(template_invocation, host)
      {}
    end

    def humanized_name
      self.name
    end

    def supports_effective_user?
      false
    end
  end
end
