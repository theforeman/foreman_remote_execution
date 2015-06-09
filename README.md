Foreman Remote Execution
========================

A plugin bringing remote execution to the Foreman, completing the config
management functionality with remote management functionality.

Links
-----

* [the project page](http://theforeman.github.io/foreman_remote_execution/)
* [the issue tracker](http://projects.theforeman.org/projects/foreman_remote_execution)

Generating the docs
-------------------

0. ``cd doc``

0. ``mkdir .bin`` # only first time

1. ``bundle install``

2. ``bundle exec rake plantuml_install`` to install prerequisites

3. ``bundle exec jekyll serve`` to see the rendered changes locally

4. ``bundle exec rake publish`` to publish the changes to Github pages
