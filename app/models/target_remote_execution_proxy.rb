class TargetRemoteExecutionProxy < ApplicationRecord
  belongs_to :remote_execution_proxy, :class_name => 'SmartProxy'
  belongs_to :target, :polymorphic => true
end
