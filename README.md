Foreman Remote Execution
========================

See [the project page](https://inecas.github.io/foreman-rex) for more
details.

Generating the docs
-------------------

0. ``cd doc``

0. ``mkdir .bin`` # only first time

1. ``bundle install``

2. ``bundle exec rake plantuml_install`` to install prerequisites

3. ``bundle exec jekyll serve`` to see the rendered changes locally

4. ``bundle exec rake publish`` to publish the changes to Github pages
