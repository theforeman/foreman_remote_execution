# frozen_string_literal: true

require 'rbnacl/sodium'

module RbNaCl
  # Provides helpers for defining the libsodium bindings
  module Sodium
    def self.extended(klass)
      klass.extend FFI::Library
      klass.ffi_lib ['sodium', 'libsodium.so.18', 'libsodium.so.23']
    end
  end

  module Init
    RBNACL_LIBSODIUM_GEM_LIB_PATH = 'libsodium.so.23'
  end
end

require 'rbnacl'
