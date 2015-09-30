class InputTemplateRenderer
  class UndefinedInput < ::Foreman::Exception
  end

  include UnattendedHelper

  attr_accessor :template, :host, :invocation, :error_message

  # takes template object that should be rendered
  # host and template invocation arguments are optional
  # so we can render values based on parameters, facts or user inputs
  def initialize(template, host = nil, invocation = nil)
    @host = host
    @invocation = invocation
    @template = template
  end

  def render
    render_safe(@template.template, ::Foreman::Renderer::ALLOWED_HELPERS + [ :input ], :host => @host)
  rescue => e
    self.error_message ||= _('error during rendering: %s') % e.message
    Rails.logger.debug e.to_s + "\n" + e.backtrace.join("\n")
    return false
  end

  def preview
    @preview = true
    output = render
    @preview = false
    output
  end

  def input(name)
    input = @template.template_inputs.where(:name => name.to_s).first || @template.template_inputs.detect { |i| i.name == name.to_s }
    if input
      @preview ? input.preview(self) : input.value(self)
    else
      self.error_message = _('input macro with name \'%s\' used, but no input with such name defined for this template') % name
      raise UndefinedInput, "Rendering failed, no input with name #{name} for input macro found"
    end
  end

  def logger
    Rails.logger
  end
end
