require File.expand_path('../lib/foreman_remote_execution/version', __FILE__)
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

  s.files = Dir['{app,config,db,extra,lib,locale,webpack}/**/*'] + ['LICENSE', 'Rakefile', 'README.md', 'package.json']
  s.extra_rdoc_files = Dir['README.md', 'LICENSE']

  s.required_ruby_version = '>= 2.7', '< 4'

  s.add_dependency 'deface'
  s.add_dependency 'dynflow', '>= 1.0.2', '< 2.0.0'
  s.add_dependency 'foreman-tasks', '>= 8.3.0'

  s.add_development_dependency 'factory_bot_rails', '~> 4.8.0'
  s.add_development_dependency 'rdoc'
end
