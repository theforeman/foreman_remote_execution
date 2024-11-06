# Tasks
namespace :foreman_remote_execution do
  namespace :example do
    desc 'Example Task'
    task task: :environment do
      # Task goes here
    end
  end
end

# Tests
namespace :test do
  desc 'Test ForemanRemoteExecution'
  Rake::TestTask.new(:foreman_remote_execution => ['db:test:prepare']) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
    t.test_files = [
      Rails.root.join('test/unit/foreman/access_permissions_test.rb'),
    ]
  end
end

Rake::Task[:test].enhance ['test:foreman_remote_execution']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_remote_execution']
end
