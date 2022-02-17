[![Build Status](https://img.shields.io/jenkins/s/http/ci.theforeman.org/test_plugin_foreman_remote_execution_master.svg)](http://ci.theforeman.org/job/test_plugin_foreman_remote_execution_master)
[![Gem Version](https://img.shields.io/gem/v/foreman_remote_execution.svg)](https://rubygems.org/gems/foreman_remote_execution)
[![Code Climate](https://codeclimate.com/github/theforeman/foreman_remote_execution/badges/gpa.svg)](https://codeclimate.com/github/theforeman/foreman_remote_execution)
[![GPL License](https://img.shields.io/github/license/theforeman/foreman_remote_execution.svg)](https://github.com/theforeman/foreman_remote_execution/blob/master/LICENSE)

# Foreman Remote Execution

A plugin bringing remote execution to the Foreman, completing the config
management functionality with remote management functionality.

* Website: [theforeman.org](http://theforeman.org)
* Support: [Foreman support](http://theforeman.org/support.html)

## Features

* Visualize remote execution job process live
![job detail](http://theforeman.org/plugins/foreman_remote_execution/0.0/job_detail_1.png)
* Schedule or run jobs on hosts
![invocation form](http://theforeman.org/plugins/foreman_remote_execution/0.0/invocation_form.png)
* Create templates to customize your jobs
![job templates](http://theforeman.org/plugins/foreman_remote_execution/0.0/job_template_form.png)

## Installation and usage

Check the Foreman manual [remote execution section](http://theforeman.org/plugins/foreman_remote_execution/)

## Compatibility

| Foreman Version | Plugin Version |
| --------------- | -------------- |
| >= 3.1          | ~> 5.0.0       |
| >= 3.2          | >= 6.0.0       |

## Simulated runs
There is an option to use an alternative `ScriptRunner` implementation. Instead of doing ssh connections it discards any input its given and gives back fake output.

It is controlled by setting the following environment variables
`REX_SIMULATE` - setting to 1, yes or true enables the use of the fake runner
`REX_SIMULATE_PATH` - full path to a file which should be given back as output by the runner, currently one line per runner's refresh
`REX_SIMULATE_FAIL_CHANCE` - number from 0 to 100, each host has a `REX_SIMULATE_FAIL_CHANCE` of exiting with `REX_SIMULATE_EXIT`, useful for simulating random failures
`REX_SIMULATE_EXIT` - see the previous

Because it doesn't really open the outgoing connections, it doesn't need hosts with valid IP addresses as targets.

## Links

* [Design document](http://theforeman.github.io/foreman_remote_execution/design/)
* [Issue tracker](http://projects.theforeman.org/projects/foreman_remote_execution)

## Contributing

Fork and send a Pull Request. Thanks!

To run Rubocop use the rake task in foreman dir:

    bundle exec rake foreman_remote_execution:rubocop

Auto correct can be executed directly too:

    bundle exec rubocop ~/work/foreman_remote_execution -a

## Release Process

### Pull Translations from Transifex

As part of the release process, localization must be synced from Transifex. See the [wiki](http://projects.theforeman.org/projects/foreman/wiki/How_to_Create_a_Plugin#Pulling-translations-from-Transifex) for more information.

### Sync Job Templates from Community Templates

The [community-templates](https://github.com/theforeman/community-templates.git) repo is the source for our job templates.  Prior to release, use the script/sync_templates.sh script to pull in any changes.


## Copyright

Copyright (c) 2015 The Foreman developers

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

