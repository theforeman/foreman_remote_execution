# -*- coding: utf-8 -*-
require File.expand_path('../lib/foreman_remote_execution_core/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_remote_execution_core'
  s.version     = ForemanRemoteExecutionCore::VERSION
  s.authors     = ['Ivan Nečas']
  s.email       = ['inecas@redhat.com']
  s.homepage    = 'https://github.com/theforeman/foreman_remote_execution'
  s.summary     = 'Foreman remote execution - core bits'
  s.description = <<DESC
  Ssh remote execution provider code sharable between Foreman and Foreman-Proxy
DESC
  s.license = 'GPLv3'

  s.files = Dir['lib/foreman_remote_execution_core/**/*'] +
            ['lib/foreman_remote_execution_core.rb', 'LICENSE']

  s.add_runtime_dependency('foreman-tasks-core', '>= 0.1.3')
  s.add_runtime_dependency('net-ssh')
end
