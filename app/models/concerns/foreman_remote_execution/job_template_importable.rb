module ForemanRemoteExecution
  module JobTemplateImportable
    extend ActiveSupport::Concern
    include ::ForemanTemplates::TemplateImportCommon if defined? ForemanTemplates

    def template_content_attr
      :template
    end

    def template_content
      self.public_send(template_content_attr)
    end

    def association_attrs
      %i{ location_ids organization_ids }
    end

    def template_changed?(attrs_to_update)
      return true unless persisted?
      saved_template = self.class.find id
      job_template_attrs_changed?(attrs_to_update) ||
      inputs_changed?(saved_template) ||
      features_changed?(saved_template)
    end

    def job_template_attrs_changed?(attrs_to_update)
      template_content != attrs_to_update[template_content_attr] ||
      provider_type != attrs_to_update['provider_type'] ||
      description_format != attrs_to_update['description_format'] ||
      job_category != attrs_to_update['job_category']
    end

    def inputs_changed?(saved_template)
      template_inputs_changed?(saved_template) || foreign_inputs_changed?(saved_template)
    end

    def template_inputs_changed?(saved_template)
      associated_changed? saved_template, :template_inputs
    end

    def foreign_inputs_changed?(saved_template)
      associated_changed? saved_template, :foreign_input_sets
    end

    def features_changed?(saved_template)
      associated_changed? saved_template, :remote_execution_features
    end

    def associated_changed?(saved_template, attr_key)
      self.public_send(attr_key).map(&:name).sort != saved_template.public_send(attr_key).map(&:name).sort
    end

    def build_new_associations(metadata)
      # handle inputs and feature here
    end

    module ClassMethods
      def attrs_to_import(metadata, template_text)
        {
          :template => template_text,
          :provider_type => metadata['provider_type'],
          :description_format => metadata['description_format'],
          :job_category => metadata['job_category'],
        }
      end

      def associations_update_attrs(associations)
        {
          :location_ids        => associations[:locations].map(&:id),
          :organization_ids    => associations[:organizations].map(&:id)
        }
      end
    end
  end
end