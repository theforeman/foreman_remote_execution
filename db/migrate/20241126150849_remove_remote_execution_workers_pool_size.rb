class RemoveRemoteExecutionWorkersPoolSize < ActiveRecord::Migration[6.1]
  def up
    Setting.find_by(:name => 'remote_execution_workers_pool_size')&.delete
  end

  def down
  end
end
