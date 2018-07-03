class InputTemplateRenderer
  class UndefinedInput < ::Foreman::Exception
  end

  class RenderError < ::Foreman::Exception
  end

  delegate :logger, to: Rails

  attr_accessor :template, :host, :invocation, :input_values, :error_message, :templates_stack

  # takes template object that should be rendered
  # host and template invocation arguments are optional
  # so we can render values based on parameters, facts or user inputs
  def initialize(template, host = nil, invocation = nil, input_values = nil, preview = false, templates_stack = [])
    raise Foreman::Exception, N_('Recursive rendering of templates detected') if templates_stack.include?(template)

    @host = host
    @template = template
    @invocation = invocation
    @input_values = input_values
    @preview = preview
    @templates_stack = templates_stack + [template]
  end

  def render
    @template.validate_unique_inputs!
    source = Foreman::Renderer.get_source(
      template: template,
      host: host
    )
    scope = Foreman::Renderer.get_scope(
      host: host,
      klass: renderer_scope,
      variables: {
        host: host,
        template: template,
        preview: @preview,
        invocation: invocation,
        input_values: input_values,
        templates_stack: templates_stack,
        input_template_instance: self
      }
    )
    Foreman::Renderer.render(source, scope)
  rescue => e
    self.error_message ||= _('error during rendering: %s') % e.message
    Foreman::Logging.exception('Error during rendering of a job template', e)
    false
  end

  def input(name)
    return @input_values[name.to_s] if @input_values
    input = find_by_name(template.template_inputs_with_foreign, name) # rubocop:disable Rails/DynamicFindBy
    if input
      @preview ? input.preview(self) : input.value(self)
    else
      error_message = _('input macro with name \'%s\' used, but no input with such name defined for this template') % name
      raise UndefinedInput, "Rendering failed, no input with name #{name} for input macro found"
    end
  end

  def preview
    old_preview = @preview
    @preview = true
    render
  ensure
    @preview = old_preview
  end

  private

  def renderer_scope
    ForemanRemoteExecution::Renderer::Scope::Input
  end

  def find_by_name(collection, name)
    collection.detect { |i| i.name == name.to_s }
  end
end
