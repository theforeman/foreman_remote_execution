module ForemanRemoteExecution
  module Exportable
    extend ActiveSupport::Concern

    def to_export
      self.class.exportable_attributes.inject({}) do |hash, attribute|
        value = self.send(attribute)
        value = value.respond_to?(:to_export) ? value.to_export : value
        value = value.respond_to?(:map) ? export_iterable(value) : value
        value.blank? ? hash : hash.update(attribute => value)
      end.stringify_keys
    end

    def export_iterable(items)
      items.map do |item|
        item.respond_to?(:to_export) ? item.to_export : item
      end
    end

    module ClassMethods
      def attr_exportable(*args)
        @attr_exportable ||= []
        @attr_exportable += args
      end

      def exportable_attributes
        @attr_exportable.dup
      end
    end

  end
end
