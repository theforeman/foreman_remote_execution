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
      self.class.exportable_attributes.inject({}) do |hash, attribute|
        value = export_attr(attribute)
        value.blank? ? hash : hash.update(attribute => value)
      end.stringify_keys
    end

    def export_attr(attribute)
      value = self.send(attribute) if self.respond_to?(attribute)

      if self.class.custom_exports.include?(attribute)
        self.class.custom_exports[attribute].call(self)
      elsif value.respond_to?(:to_export)
        value.to_export
      elsif value.respond_to?(:map)
        export_iterable(value)
      else
        value
      end
    end

    def export_iterable(items)
      items.map do |item|
        item.respond_to?(:to_export) ? item.to_export : item
      end
    end

    module ClassMethods
      attr_reader :exportable_attributes, :custom_exports

      # Takes an array of exportable attributes, or a custom exports hash.  The
      # custom exports hash should be a key/proc pair used to export the
      # particular attribute.
      def attr_exportable(*args)
        @custom_exports = args.last.is_a?(Hash) ? args.pop : {}
        @exportable_attributes ||= []
        @exportable_attributes += args + @custom_exports.keys
      end
    end

  end
end
