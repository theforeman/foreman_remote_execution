#!/bin/bash
set -euo pipefail

echo "Running remote execution test: uptime"

hammer job-invocation create \
  --job-template 'Run Command - Script Default' \
  --inputs 'command=uptime' \
  --search-query "name ~ $(hostname -f)"

