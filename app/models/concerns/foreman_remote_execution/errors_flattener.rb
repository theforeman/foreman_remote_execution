module ForemanRemoteExecution
  module ErrorsFlattener
    def flattened_validation_exception
      ActiveRecord::RecordNotSaved.new(I18n.t("activerecord.errors.messages.record_invalid", :errors => flattened_errors.join(', ')))
    end

    def flattened_errors
      errors = Hash.new { |h, k| h[k] = [] }
      self.errors.keys.each do |key|
        messages = self.errors[key]
        invalid_objects = invalid_objects_for_attribute(key)
        if invalid_objects.blank?
          errors[key] = messages
        else
          invalid_objects.each do |invalid_object|
            errors.merge!(sub_object_errors(key, invalid_object, messages))
          end
        end
      end
      errors.map { |key, messages| self.errors.full_message(key, messages.join(', ')) }
    end

    private

    def invalid_objects_for_attribute(attribute)
      if self.respond_to?(attribute)
        invalid_object = self.public_send(attribute)
        if invalid_object.is_a? Enumerable
          invalid_object.select { |o| o.respond_to?(:invalid?) && o.invalid? }
        else
          [invalid_object]
        end
      end
    end

    def flattened_error_key(key, object)
      mapping = if defined? self.class::FLATTENED_ERRORS_MAPPING
                  self.class::FLATTENED_ERRORS_MAPPING
                else
                  {}
                end
      mapped_key = mapping.fetch(key, key)
      if mapped_key.is_a? Proc
        mapped_key.call(object)
      else
        mapped_key
      end
    end

    def sub_object_errors(key, object, original_message)
      key = flattened_error_key(key, object)
      errors = if object.respond_to? :flattened_errors
                 object.flattened_errors
               elsif object.respond_to? :errors
                 object.errors.full_messages
               else
                 original_message
               end
      return { "#{key}:" => errors }
    end
  end
end
