Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
    'script_execution_provider' => 'ScriptExecutionProvider',
    'remote_execution_ssh' => 'RemoteExecutionSSH'
  )
end
