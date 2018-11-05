module ForemanRemoteExecution
  module Renderer
    module Scope
      class Input < ::Foreman::Renderer::Scope::Template
        include Foreman::Renderer::Scope::Macros::HostTemplate

        attr_reader :template, :host, :invocation, :input_template_instance, :current_user
        delegate :input, to: :input_template_instance

        def render_error(message)
          raise ::InputTemplateRenderer::RenderError.new(message)
        end

        def preview?
          !!@preview
        end

        def cached(key, &block)
          return yield if preview?

          cache_key = "#{JobInvocation::CACHE_PREFIX}_#{invocation.job_invocation_id}_#{key}"
          Rails.logger.debug "cache hit for #{cache_key}" if Rails.cache.exist?(cache_key)
          Rails.cache.fetch(cache_key, &block)
        end

        def render_template(template_name, input_values = {}, options = {})
          options.assert_valid_keys(:with_foreign_input_set)
          with_foreign_input_set = options.fetch(:with_foreign_input_set, true)
          template = @template.class.authorized("view_#{@template.class.to_s.underscore.pluralize}").find_by(name: template_name)
          unless template
            self.error_message = _('included template \'%s\' not found') % template_name
            raise error_message
          end

          default_values = template.default_input_values(input_values.keys)
          if with_foreign_input_set
            input_values = foreign_input_set_values(template, input_values)
          end
          input_values = default_values.merge(input_values).with_indifferent_access

          included_renderer = InputTemplateRenderer.new(template, host, invocation, input_values, @preview, @templates_stack)
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

          inputs_to_generate = input_set.inputs.map { |i| i.name.to_s } - overrides.keys.map(&:to_s)
          input_values = inputs_to_generate.inject(HashWithIndifferentAccess.new) do |hash, input_name|
            hash.merge(input_name.to_s => input(input_name))
          end
          input_values.merge(overrides).with_indifferent_access
        end

        def input(name)
          return template_input_values[name.to_s] if template_input_values.key?(name.to_s)

          input = find_by_name(template.template_inputs_with_foreign, name) # rubocop:disable Rails/DynamicFindBy
          if input
            @preview ? input.preview(self) : input.value(self)
          else
            error_message = _('input macro with name \'%s\' used, but no input with such name defined for this template') % name
            raise UndefinedInput, "Rendering failed, no input with name #{name} for input macro found"
          end
        end

        def allowed_helpers
          super + [:input, :render_template, :preview?, :render_error, :current_user]
        end

        private

        def find_by_name(collection, name)
          collection.detect { |i| i.name == name.to_s }
        end
      end
    end
  end
end
