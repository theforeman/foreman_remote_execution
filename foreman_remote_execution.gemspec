require File.expand_path('lib/foreman_remote_execution/version', __dir__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_remote_execution'
  s.version     = ForemanRemoteExecution::VERSION
  s.license     = 'GPL-3.0'
  s.date        = Date.today.to_s
  s.authors     = ['Foreman Remote Execution team']
  s.email       = ['foreman-dev@googlegroups.com']
  s.homepage    = 'https://github.com/theforeman/foreman_remote_execution'
  s.summary     = 'A plugin bringing remote execution to the Foreman, completing the config ' +
                  'management functionality with remote management functionality.'
  # also update locale/gemspec.rb
  s.description = 'A plugin bringing remote execution to the Foreman, completing the config ' +
                  'management functionality with remote management functionality.'

  s.files =            `git ls-files`.split("\n").reject do |file|
    file =~ /^scripts/ ||
        file.start_with?('lib/foreman_remote_execution_core') ||
        file == 'foreman_remote_execution_core.gemspec'
  end

  s.test_files =       `git ls-files test`.split("\n")
  s.extra_rdoc_files = Dir['README*', 'LICENSE']

  s.add_dependency 'deface'
  s.add_dependency 'dynflow', '>= 1.0.1', '< 2.0.0'
  s.add_dependency 'foreman-tasks', '>= 0.15.1'
  s.add_dependency 'foreman_remote_execution_core'

  s.add_development_dependency 'factory_bot_rails', '~> 4.8.0'
  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop'
end
