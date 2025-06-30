#!/bin/bash
set -euo pipefail

echo "Running remote execution test: uptime"

job_template='Run Command - Script Default'
SMART_PROXY_NAME=$(hostname -f)
ORG="Test Org"
REX_ORG="Remote Execution Org $$"

OLD_ORGS=$(hammer --output csv --no-headers --show-ids proxy info --name "${SMART_PROXY_NAME}" --fields Organizations)

hammer organization create --name "${REX_ORG}"
hammer host update --name "${SMART_PROXY_NAME}" --new-organization "${REX_ORG}"
hammer proxy update --name "${SMART_PROXY_NAME}" --organizations "${OLD_ORGS},${REX_ORG}"

hammer job-invocation create \
  --job-template "${job_template}" \
  --inputs 'command=uptime' \
  --search-query "name = ${SMART_PROXY_NAME}"

JOB_ID=$(hammer --csv job-invocation list | grep "${job_template}" | head -n1 | cut -d',' -f1)

STATUS=$(hammer --csv job-invocation info --id "$JOB_ID" | grep '^Status,' | cut -d',' -f2)

if [[ "$STATUS" == "Succeeded" || "$STATUS" == "Finished" ]]; then
  echo "Remote job succeeded"
else
  echo "Remote job failed with status: $STATUS"
  exit 1
fi

echo "Test completed successfully."
