# This calls the main test_helper in Foreman-core
require 'test_helper'
require 'database_cleaner'
require 'dynflow/testing'

# Add plugin to FactoryGirl's paths
FactoryGirl.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
# Add foreman tasks factories too
FactoryGirl.definition_file_paths << "#{ForemanTasks::Engine.root}/test/factories"
FactoryGirl.reload

# Foreman's setup doesn't handle cleaning up for Minitest::Spec
DatabaseCleaner.strategy = :transaction

class Minitest::Spec
  class << self
    alias context describe
  end

  before :each do
    DatabaseCleaner.start
    Setting::RemoteExecution.load_defaults
  end

  after :each do
    DatabaseCleaner.clean
  end
end
