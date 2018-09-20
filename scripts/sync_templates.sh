#!/bin/bash
#
# Copies job templates from community-templates repository to
# app/views/templates/ so they can be seeded on new installations.
#
# Part of the release process.

REPO=$(mktemp -d)
trap "rm -rf $REPO" EXIT
shopt -s extglob

git clone -q -b develop https://github.com/theforeman/community-templates $REPO/ct

pushd $PWD
cd $REPO/ct/job_templates

# Delete all non-ssh templates and remove suffix
rm !(*ssh_default.erb)
for i in *.erb
do
  mv $i ${i%%_-_ssh_default.erb}.erb
done

popd

# Move into destination dir if run from plugin root
[ -d app/views/templates/ssh ] && cd app/views/templates/ssh

rsync -r \
  --exclude README.md \
  --exclude '.*' \
  --exclude test \
  --exclude Rakefile \
  $REPO/ct/job_templates/*.erb ./

cd -

git status -- app/views/templates/ssh

if [ $(git status --porcelain -u -- app/views/templates | grep -c '^\?') -gt 0 ]; then
  echo
  echo "Warning: new files copied, be sure to commit them and ensure they are seeded."
fi
