module ForemanRemoteExecution
  module EncryptedValueExtensions
    def encrypted_attributes(*attrs)
      attrs.each do |attr|
        self.send(:define_method, attr) do
          v = read_attribute(attr)
          return if v.nil?
          decrypt_field(v)
        end

        self.send(:define_method, :"#{attr}=") do |v|
          # Don't re-write the attribute if the current encrypted value is identical to the new one
          current_value = read_attribute(attr)
          unless is_decryptable?(current_value) && decrypt_field(current_value) == v
            write_attribute attr, encrypt_field(v)
          end
        end
        self.send(:alias_method, :"#{attr}_before_type_cast", attr)
      end
    end
  end
end
