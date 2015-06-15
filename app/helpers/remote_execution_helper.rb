module RemoteExecutionHelper
  def providers_options
    ExecutionProvider.providers.map { |key, provider| [ key, _(provider) ] }
  end
end
