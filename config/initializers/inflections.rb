Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
    'remote_execution_ssh' => 'RemoteExecutionSSH'
  )
end
