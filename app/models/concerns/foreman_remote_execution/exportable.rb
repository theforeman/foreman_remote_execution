# This concern makes it easy to export an ActiveRecord object with specified
# attributes and associations only.  If a specified assocation also includes
# this concern, then it will likewise be exported. Custom attributes can be
# specified as an options hast consisting of a custom export lambda.
#
# Example:
#   attr_exportable :name, :address, :company => ->(user) { user.company.name }
#
module ForemanRemoteExecution
  module Exportable
    extend ActiveSupport::Concern

    def to_export
      self.class.exportable_attributes.keys.inject({}) do |hash, attribute|
        value = export_attr(attribute, self.class.exportable_attributes[attribute])
        value.blank? ? hash : hash.update(attribute => value)
      end.stringify_keys
    end

    def export_attr(attribute, exporter)
      value = if exporter.respond_to?(:call)
                exporter.call(self)
              elsif self.respond_to?(exporter)
                self.send(exporter)
              end

      value.respond_to?(:map) ? export_iterable(value) : value
    end

    def export_iterable(items)
      items.map { |item| item.respond_to?(:to_export) ? item.to_export : item }
    end

    module ClassMethods
      attr_reader :exportable_attributes

      # Takes an array of exportable attributes, or a custom exports hash.  The
      # custom exports hash should be a key/proc pair used to export the
      # particular attribute.
      def attr_exportable(*args)
        @exportable_attributes ||= {}
        args.each do |arg|
          if arg.is_a?(Hash)
            @exportable_attributes.merge!(arg)
          else
            @exportable_attributes.merge!(arg => arg)
          end
        end
      end
    end

  end
end
