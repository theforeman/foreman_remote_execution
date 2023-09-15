node :permissions do
  @permissions
end
child @remote_execution_features do
  extends 'api/v2/remote_execution_features/main'
end
