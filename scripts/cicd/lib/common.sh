#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ENV_DIR="${ROOT_DIR}/scripts/cicd/env"

log() {
  printf '[INFO] %s\n' "$*"
}

fail() {
  printf '[ERROR] %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

use_env() {
  local target_env="${1:-}"
  [[ -n "${target_env}" ]] || fail "Usage: <script> <local|dev|stage|prod>"
  local env_file="${ENV_DIR}/${target_env}.sh"
  [[ -f "${env_file}" ]] || fail "Unknown environment: ${target_env}"

  # shellcheck disable=SC1090
  source "${env_file}"
  export ROOT_DIR
  export TARGET_ENV="${target_env}"
}

compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi
  fail "docker compose (plugin) or docker-compose is required"
}
