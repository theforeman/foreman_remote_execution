class InputTemplateRenderer
  class UndefinedInput < ::Foreman::Exception
  end

  class RenderError < ::Foreman::Exception
  end

  delegate :logger, to: Rails

  attr_accessor :template, :host, :invocation, :template_input_values, :error_message, :templates_stack, :current_user

  # takes template object that should be rendered
  # host and template invocation arguments are optional
  # so we can render values based on parameters, facts or user inputs
  def initialize(template, host = nil, invocation = nil, input_values = nil, preview = false, templates_stack = [])
    raise Foreman::Exception, N_('Recursive rendering of templates detected') if templates_stack.include?(template)

    @host = host
    @template = template
    @invocation = invocation
    @template_input_values = input_values
    @preview = preview
    @templates_stack = templates_stack + [template]
  end

  def render
    @template_input_values ||= values_from_invocation
    @template.validate_unique_inputs!
    source = Foreman::Renderer.get_source(
      template: template,
      host: host
    )
    @scope = Foreman::Renderer.get_scope(
      host: host,
      klass: renderer_scope,
      template_input_values: @template_input_values,
      variables: {
        host: host,
        template: template,
        preview: @preview,
        invocation: invocation,
        input_values: @template_input_values,
        templates_stack: templates_stack,
        input_template_instance: self,
        current_user: User.current.try(:login)
      }
    )
    Foreman::Renderer.render(source, @scope)
  rescue => e
    self.error_message ||= _('error during rendering: %s') % e.message
    Foreman::Logging.exception('Error during rendering of a job template', e)
    false
  end

  def preview
    old_preview = @preview
    @preview = true
    render
  ensure
    @preview = old_preview
  end

  private

  def values_from_invocation
    input_values = @invocation ? Hash[@invocation.input_values.map { |iv| [iv.template_input.name, iv.value] }] : {}
    default_values = template.default_input_values(input_values.keys)
    result = @preview ? input_values : default_values.merge(input_values)
    result.with_indifferent_access
  end

  def renderer_scope
    ForemanRemoteExecution::Renderer::Scope::Input
  end

  def find_by_name(collection, name)
    collection.detect { |i| i.name == name.to_s }
  end
end
