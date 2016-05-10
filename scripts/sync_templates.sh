#!/bin/sh
#
# Copies job templates from community-templates repository to
# app/views/templates/ so they can be seeded on new installations.
#
# Part of the release process.

REPO=$(mktemp -d)
trap "rm -rf $REPO" EXIT

git clone -q -b develop https://github.com/theforeman/community-templates $REPO/ct

# Move into destination dir if run from plugin root
[ -d app/views/templates ] && cd app/views/templates

# Add underscore prefix to snippets
if [ -d $REPO/ct/jobs/snippets ];
then
  for i in $REPO/ct/jobs/snippets/*;
  do
    mv $i $REPO/ct/jobs/snippets/_$(basename $i)
  done
fi

rsync -r \
  --exclude README.md \
  --exclude '.*' \
  --exclude test \
  --exclude Rakefile \
  $REPO/ct/jobs/ ./

cd -

git status -- app/views/templates

if [ $(git status --porcelain -u -- app/views/templates | grep -c '^\?') -gt 0 ]; then
  echo
  echo "Warning: new files copied, be sure to commit them and ensure they are seeded."
fi
