module ForemanRemoteExecution
  module HostExtensions
    extend ActiveSupport::Concern

    included do
      has_many :targeting_hosts, :dependent => :destroy, :foreign_key => 'host_id'
    end

    # create or overwrite instance methods...
    def instance_method_name
    end

    module ClassMethods
      # create or overwrite class methods...
      def class_method_name
      end
    end
  end
end
