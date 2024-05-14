Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
    'ssh_execution_provider' => 'SSHExecutionProvider',
    'remote_execution_ssh' => 'RemoteExecutionSSH'
  )
end
