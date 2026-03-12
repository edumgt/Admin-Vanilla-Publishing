#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

use_env "${1:-}"
cd "${ROOT_DIR}"

log "Running CI checks for ${TARGET_ENV} (${DEPLOY_MODE})"

require_cmd python3
python3 -m compileall "${ROOT_DIR}/backend_fastapi/app" >/dev/null

case "${DEPLOY_MODE}" in
  local)
    require_cmd docker
    COMPOSE_CMD="$(compose_cmd)"
    ${COMPOSE_CMD} -f "${ROOT_DIR}/backend_fastapi/docker-compose.yml" config >/dev/null
    ${COMPOSE_CMD} --env-file "${ROOT_DIR}/infra/docker/.env.example" \
      -f "${ROOT_DIR}/infra/docker/docker-compose.onprem.yml" config >/dev/null
    ;;
  k8s)
    require_cmd kubectl
    kubectl kustomize "${ROOT_DIR}/${K8S_OVERLAY}" >/dev/null
    ;;
  aws-serverless)
    require_cmd sam
    sam build --template-file "${ROOT_DIR}/infra/aws/template.yaml" >/dev/null
    ;;
  *)
    fail "Unsupported deploy mode: ${DEPLOY_MODE}"
    ;;
esac

log "CI checks completed for ${TARGET_ENV}"
