module ForemanRemoteExecution
  module UserExtensions
    extend ActiveSupport::Concern

    included do
      has_many :targetings, :dependent => :nullify
      has_many :job_actions, dependent: :destroy
    end
  end
end
