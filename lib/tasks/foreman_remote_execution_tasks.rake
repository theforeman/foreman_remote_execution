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
  end
end

namespace :foreman_remote_execution do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_remote_execution) do |task|
        task.patterns = ["#{ForemanRemoteExecution::Engine.root}/app/**/*.rb",
                         "#{ForemanRemoteExecution::Engine.root}/lib/**/*.rb",
                         "#{ForemanRemoteExecution::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_remote_execution'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_remote_execution']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_remote_execution', 'foreman_remote_execution:rubocop']
end
