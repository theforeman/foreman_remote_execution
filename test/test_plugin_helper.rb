# This calls the main test_helper in Foreman-core
require 'test_helper'
require 'dynflow/testing'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
# Add foreman tasks factories too
FactoryBot.definition_file_paths << "#{ForemanTasks::Engine.root}/test/factories"
FactoryBot.reload
