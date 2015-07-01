module RemoteExecutionHelper
  def providers_options
    RemoteExecutionProvider.providers.map { |key, provider| [ key, _(provider) ] }
  end

  def template_input_types_options
    TemplateInput::TYPES.map { |key, name|
      [ _(name), key ]
    }
  end
end
