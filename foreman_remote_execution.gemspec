require File.expand_path('../lib/foreman_remote_execution/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_remote_execution'
  s.version     = ForemanRemoteExecution::VERSION
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
  s.extra_rdoc_files = `git ls-files doc`.split("\n") + Dir['README*', 'LICENSE']

  s.add_dependency 'deface'
  s.add_dependency 'dynflow', '~> 0.8.10'
  s.add_dependency 'foreman_remote_execution_core'
  s.add_dependency 'foreman-tasks', '~> 0.9.0'

  s.add_development_dependency 'rubocop'
  s.add_development_dependency 'rdoc'
end
