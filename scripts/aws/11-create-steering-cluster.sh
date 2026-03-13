#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-2}"
CLUSTER_NAME="${CLUSTER_NAME:-admin-vanilla-steering}"
NODE_TYPE="${NODE_TYPE:-t3.medium}"
NODE_COUNT="${NODE_COUNT:-2}"

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Missing required command: $1" >&2
    exit 1
  }
}

require aws
require eksctl
require kubectl

aws sts get-caller-identity >/dev/null

if ! eksctl get cluster --name "${CLUSTER_NAME}" --region "${REGION}" >/dev/null 2>&1; then
  eksctl create cluster \
    --name "${CLUSTER_NAME}" \
    --region "${REGION}" \
    --managed \
    --with-oidc \
    --nodes "${NODE_COUNT}" \
    --node-type "${NODE_TYPE}" \
    --tags "Project=AdminVanilla,Role=Steering"
fi

aws eks update-kubeconfig --name "${CLUSTER_NAME}" --region "${REGION}"
kubectl get nodes -o wide
