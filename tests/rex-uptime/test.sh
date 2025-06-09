#!/bin/bash
set -euo pipefail

echo "Running remote execution test: uptime"

job_template='Run Command - Script Default'
SMART_PROXY_NAME=$(hostname -f)
REX_ORG="Remote Execution Org $$"

OLD_ORGS=$(hammer --output csv --no-headers --show-ids proxy info --name "${SMART_PROXY_NAME}" --fields Organizations)

hammer organization create --name "${REX_ORG}"
hammer host update --name "${SMART_PROXY_NAME}" --new-organization "${REX_ORG}"
hammer proxy update --name "${SMART_PROXY_NAME}" --organizations "${OLD_ORGS},${REX_ORG}"

hammer job-invocation create \
  --job-template "${job_template}" \
  --inputs 'command=uptime' \
  --search-query "name = ${SMART_PROXY_NAME}"

echo "Test completed successfully."
