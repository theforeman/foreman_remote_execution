class TargetRemoteExecutionProxy < ActiveRecord::Base
  belongs_to :remote_execution_proxy, :class_name => 'SmartProxy'
  belongs_to :target, :polymorphic => true
end
