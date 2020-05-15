class DefaultProxyProxySelector < ::RemoteExecutionProxySelector
  def initialize
    # TODO: Remove this once we have a reliable way of determining the internal proxy without katello
    # Tracked as https://projects.theforeman.org/issues/29840
    raise _('Internal proxy selector can only be used if Katello is enabled') unless defined?(::Katello)

    super
  end

  def available_proxies(host, provider)
    # TODO: Once we have a internal proxy marker/feature on the proxy, we can
    # swap the implementation
    internal_proxy = ::Katello.default_capsule
    super.reduce({}) do |acc, (key, proxies)|
      acc.merge(key => proxies.select { |proxy| proxy == internal_proxy })
    end
  end
end
