class RemoteExecutionProvider
  def self.provider_for(type)
    providers[type.to_s] || providers[:ssh]
  end

  def self.providers
    @providers ||= { :ssh => N_(SSHExecutionProvider) }.with_indifferent_access
  end

  def self.register(key, klass)
    providers[key.to_sym] = klass
  end

  def self.provider_names
    providers.keys.map(&:to_s)
  end
end
