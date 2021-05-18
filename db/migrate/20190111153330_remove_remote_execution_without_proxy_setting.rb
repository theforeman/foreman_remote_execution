class RemoveRemoteExecutionWithoutProxySetting < ActiveRecord::Migration[5.2]
  def up
    Setting.where(name: 'remote_execution_without_proxy').delete_all
  end

  def down
    Setting.create!(:name => 'remote_execution_without_proxy',
      :description => N_('When enabled, the remote execution will try to run '\
                         'the commands directly, when no proxy with remote execution '\
                         'feature is configured for the host.'),
      :default => false, :full_name => N_('Fallback Without Proxy'))
  end
end
