#!/usr/bin/env bash
set -euo pipefail

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Missing required command: $1" >&2
    exit 1
  }
}

require kubectl

kubectl apply -f infra/aws/steering/namespace.yaml
kubectl apply -f infra/aws/steering/configmap.yaml
kubectl apply -f infra/aws/steering/steering-rbac.yaml

kubectl -n admin-vanilla-steering get configmap,serviceaccount
