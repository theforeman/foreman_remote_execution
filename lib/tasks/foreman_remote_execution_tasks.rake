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

Rake::Task["webpack:compile"].clear
# WIP: test that setting max_oldspace_size will fix rex issues: this is meant for testing only,
# it it proves to be working, the fix should go to the foreman proper
namespace :webpack do
  desc <<-EOF.strip_heredoc
  Compile webpack bundles: overriding the rake task from webpack-rails to be
  able to set the max_old_space_size option.
  EOF
  task compile: :environment do
    ENV["TARGET"] = 'production' # TODO: Deprecated, use NODE_ENV instead
    ENV["NODE_ENV"] ||= 'production'
    webpack_bin = ::Rails.root.join(::Rails.configuration.webpack.binary)
    config_file = ::Rails.root.join(::Rails.configuration.webpack.config_file)
    max_old_space_size = "2048"

    unless File.exist?(webpack_bin)
      raise "Can't find our webpack executable at #{webpack_bin} - have you run `npm install`?"
    end

    unless File.exist?(config_file)
      raise "Can't find our webpack config file at #{config_file}"
    end

    sh "node --max_old_space_size=#{max_old_space_size} #{webpack_bin} --config #{config_file} --bail"
  end
end
