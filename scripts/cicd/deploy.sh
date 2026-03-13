#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

use_env "${1:-}"
cd "${ROOT_DIR}"

log "Starting deploy for ${TARGET_ENV} (${DEPLOY_MODE})"

case "${DEPLOY_MODE}" in
  local)
    export APP_ENV BACKEND_PORT DATABASE_URL
    "${ROOT_DIR}/run_backend.sh"
    ;;
  k8s)
    require_cmd kubectl
    if [[ -n "${K8S_CONTEXT}" ]]; then
      kubectl config use-context "${K8S_CONTEXT}"
    fi
    kubectl apply -k "${ROOT_DIR}/${K8S_OVERLAY}"
    kubectl -n "${K8S_NAMESPACE}" rollout status deployment/admin-vanilla-backend --timeout="${K8S_ROLLOUT_TIMEOUT}"
    kubectl -n "${K8S_NAMESPACE}" rollout status deployment/admin-vanilla-frontend --timeout="${K8S_ROLLOUT_TIMEOUT}"
    ;;
  aws-serverless)
    require_cmd aws
    require_cmd sam
    export AWS_REGION PROJECT_NAME STACK_NAME FRONTEND_BUCKET ALLOWED_ORIGIN DATABASE_URL STAGE_NAME CLUSTER_NAME
    export ENABLE_STEERING_EKS
    "${ROOT_DIR}/scripts/aws/01-bootstrap-serverless-foundation.sh"
    "${ROOT_DIR}/scripts/aws/02-deploy-serverless-stack.sh"
    "${ROOT_DIR}/scripts/aws/03-sync-frontend.sh"
    if [[ "${ENABLE_STEERING_EKS}" == "true" ]]; then
      "${ROOT_DIR}/scripts/aws/11-create-steering-cluster.sh"
      "${ROOT_DIR}/scripts/aws/12-bootstrap-steering-addons.sh"
    fi
    ;;
  *)
    fail "Unsupported deploy mode: ${DEPLOY_MODE}"
    ;;
esac

log "Deploy completed for ${TARGET_ENV}"
