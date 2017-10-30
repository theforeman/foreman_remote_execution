module ForemanRemoteExecution
  module SubnetExtensions
    extend ActiveSupport::Concern

    included do
      has_many :target_remote_execution_proxies, :as => :target, :dependent => :destroy
      has_many :remote_execution_proxies, :dependent => :destroy, :through => :target_remote_execution_proxies
    end
  end
end
