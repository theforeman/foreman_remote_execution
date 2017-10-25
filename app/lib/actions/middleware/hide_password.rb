module Actions
  module Middleware
    class HidePassword < ::Dynflow::Middleware
      def present
        action.input['password'] = '********' if action.input['password']
        action.input['key_passphrase'] = '********' if action.input['key_passphrase']
      end
    end
  end
end
