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

  s.files =            Dir['{app,config,doc,db,lib,locale}/**/*', 'LICENSE', 'Rakefile', 'README.md']
  s.test_files =       Dir['test/**/*']
  s.extra_rdoc_files = Dir['doc/**/*', 'README*', 'LICENSE']

  s.add_dependency "deface"
  s.add_dependency "rails", "~> 3.2.8"
  s.add_dependency "foreman-tasks", "~> 0.7.6"

  s.add_development_dependency 'rubocop'
  s.add_development_dependency 'rdoc'
end
