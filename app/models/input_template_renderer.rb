class InputTemplateRenderer
  class UndefinedInput < ::Foreman::Exception
  end

  class RenderError < ::Foreman::Exception
  end

  include UnattendedHelper

  attr_accessor :template, :host, :invocation, :input_values, :error_message

  # takes template object that should be rendered
  # host and template invocation arguments are optional
  # so we can render values based on parameters, facts or user inputs
  def initialize(template, host = nil, invocation = nil, input_values = nil, preview = false, templates_stack = [])
    raise Foreman::Exception, N_('Recursive rendering of templates detected') if templates_stack.include?(template)

    @host = host
    @invocation = invocation
    @template = template
    @input_values = input_values
    @preview = preview
    @templates_stack = templates_stack + [template]
  end

  def render
    @template.validate_unique_inputs!
    render_safe(@template.template, ::Foreman::Renderer::ALLOWED_HELPERS + [ :input, :render_template, :preview?, :render_error, :cached ], :host => @host)
  rescue => e
    self.error_message ||= _('error during rendering: %s') % e.message
    Rails.logger.debug e.to_s + "\n" + e.backtrace.join("\n")
    return false
  end

  def preview
    old_preview = @preview
    @preview = true
    render
  ensure
    @preview = old_preview
  end

  def cached(key, &block)
    return yield if preview?
    cache_key = "#{JobInvocation::CACHE_PREFIX}_#{invocation.job_invocation_id}_#{key}"
    Rails.logger.debug "cache hit for #{cache_key}" if Rails.cache.exist?(cache_key)
    Rails.cache.fetch(cache_key, &block)
  end

  def input(name)
    return @input_values[name.to_s] if @input_values
    input = find_by_name(@template.template_inputs_with_foreign, name) # rubocop:disable Rails/DynamicFindBy
    if input
      @preview ? input.preview(self) : input.value(self)
    else
      self.error_message = _('input macro with name \'%s\' used, but no input with such name defined for this template') % name
      raise UndefinedInput, "Rendering failed, no input with name #{name} for input macro found"
    end
  end

  def render_error(message)
    raise RenderError.new(message)
  end

  def render_template(template_name, input_values = {}, options = {})
    options.assert_valid_keys(:with_foreign_input_set)
    with_foreign_input_set = options.fetch(:with_foreign_input_set, true)
    template = @template.class.authorized("view_#{@template.class.to_s.underscore.pluralize}").find_by(:name => template_name)
    unless template
      self.error_message = _('included template \'%s\' not found') % template_name
      raise error_message
    end
    if with_foreign_input_set
      input_values = foreign_input_set_values(template, input_values)
    end
    included_renderer = self.class.new(template, host, invocation, input_values.with_indifferent_access, @preview, @templates_stack)
    out = included_renderer.render
    if included_renderer.error_message
      self.error_message = included_renderer.error_message
      raise error_message
    else
      out
    end
  end

  def preview?
    !!@preview
  end

  def foreign_input_set_values(target_template, overrides = {})
    input_set = @template.foreign_input_sets.find_by(:target_template_id => target_template)
    return overrides if input_set.nil?

    inputs_to_generate = input_set.inputs.map(&:name) - overrides.keys.map(&:to_s)
    included_renderer = self.class.new(input_set.target_template, host, invocation, nil, @preview, @templates_stack)
    input_values = inputs_to_generate.inject(HashWithIndifferentAccess.new) do |hash, input_name|
      hash.merge(input_name => included_renderer.input(input_name))
    end
    input_values.merge(overrides)
  end

  def logger
    Rails.logger
  end

  def find_by_name(collection, name)
    collection.detect { |i| i.name == name.to_s }
  end
end
