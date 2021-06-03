# -*- coding: utf-8 -*-

require File.expand_path('../lib/foreman_remote_execution_core/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_remote_execution_core'
  s.version     = ForemanRemoteExecutionCore::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['Ivan Nečas']
  s.email       = ['inecas@redhat.com']
  s.homepage    = 'https://github.com/theforeman/foreman_remote_execution'
  s.summary     = 'Foreman remote execution - core bits'
  s.description = <<DESC
  Ssh remote execution provider code sharable between Foreman and Foreman-Proxy
DESC

  s.files = Dir['lib/foreman_remote_execution_core/**/*'] +
            ['lib/foreman_remote_execution_core.rb', 'LICENSE']

  s.add_runtime_dependency('bcrypt_pbkdf')
  s.add_runtime_dependency('ed25519')
  s.add_runtime_dependency('foreman-tasks-core', '>= 0.3.1')
  s.add_runtime_dependency('net-ssh')
  s.add_runtime_dependency('smart_proxy_remote_execution_ssh', '>= 0.4.0')
end
