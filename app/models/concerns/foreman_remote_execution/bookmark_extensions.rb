module ForemanRemoteExecution
  module BookmarkExtensions
    extend ActiveSupport::Concern

    included do
      has_many :targetings, :dependent => :nullify
    end
  end
end
