module ForemanRemoteExecution
  module Renderer
    module Scope
      class Input < ::Foreman::Renderer::Scope::Base
        include Foreman::Renderer::Scope::Macros::HostTemplate

        attr_reader :template, :host, :invocation, :input_values, :input_template_instance
        delegate :input, to: :input_template_instance

        def render_error(message)
          raise ::InputTemplateRenderer::RenderError.new(message)
        end

        def preview?
          !!@preview
        end

        def render_template(template_name, input_values = {}, options = {})
          options.assert_valid_keys(:with_foreign_input_set)
          with_foreign_input_set = options.fetch(:with_foreign_input_set, true)
          template = @template.class.authorized("view_#{@template.class.to_s.underscore.pluralize}").find_by(name: template_name)
          unless template
            self.error_message = _('included template \'%s\' not found') % template_name
            raise error_message
          end
          if with_foreign_input_set
            input_values = foreign_input_set_values(template, input_values)
          end
          included_renderer = InputTemplateRenderer.new(template, host, invocation, input_values.with_indifferent_access, @preview, @templates_stack)
          out = included_renderer.render
          if included_renderer.error_message
            @input_template_instance.error_message = included_renderer.error_message
            raise error_message
          else
            out
          end
        end

        def foreign_input_set_values(target_template, overrides = {})
          input_set = @template.foreign_input_sets.find_by(:target_template_id => target_template)
          return overrides if input_set.nil?

          inputs_to_generate = input_set.inputs.map(&:name) - overrides.keys.map(&:to_s)
          included_renderer = InputTemplateRenderer.new(input_set.target_template, host, invocation, nil, @preview, @templates_stack)
          input_values = inputs_to_generate.inject(HashWithIndifferentAccess.new) do |hash, input_name|
            hash.merge(input_name => included_renderer.input(input_name))
          end
          input_values.merge(overrides)
        end

        def allowed_helpers
          super + [:input, :render_template, :preview?, :render_error]
        end
      end
    end
  end
end
