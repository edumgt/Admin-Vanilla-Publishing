#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FASTAPI_DIR="${ROOT_DIR}/backend_fastapi"
VENV_DIR="${ROOT_DIR}/.venv"
REQ_FILE="${FASTAPI_DIR}/requirements.txt"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
COMPOSE_FILE="${FASTAPI_DIR}/docker-compose.yml"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERROR] python3 is required but not installed." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERROR] docker is required but not installed." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD=(docker-compose)
else
  echo "[ERROR] docker compose (plugin) or docker-compose is required." >&2
  exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "[ERROR] docker-compose file not found: ${COMPOSE_FILE}" >&2
  exit 1
fi

if [[ ! -d "${VENV_DIR}" ]]; then
  echo "[INFO] Creating virtual environment at ${VENV_DIR}"
  python3 -m venv "${VENV_DIR}"
fi

# shellcheck disable=SC1091
source "${VENV_DIR}/bin/activate"

if [[ ! -f "${REQ_FILE}" ]]; then
  echo "[ERROR] Requirements file not found: ${REQ_FILE}" >&2
  exit 1
fi

echo "[INFO] Installing FastAPI dependencies"
pip install --upgrade pip >/dev/null
pip install -r "${REQ_FILE}" >/dev/null

echo "[INFO] Starting PostgreSQL container from backend_fastapi"
"${DOCKER_COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" up -d db >/dev/null

if [[ -z "${DATABASE_URL:-}" ]]; then
  export DATABASE_URL='postgresql+psycopg2://newhomepage:newhomepage@localhost:5432/newhomepage'
  echo "[INFO] DATABASE_URL not set. Using default: ${DATABASE_URL}"
fi

cleanup() {
  local code=$?
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "${BACKEND_PID}" >/dev/null 2>&1; then
    kill "${BACKEND_PID}" >/dev/null 2>&1 || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "${FRONTEND_PID}" >/dev/null 2>&1; then
    kill "${FRONTEND_PID}" >/dev/null 2>&1 || true
  fi
  exit "${code}"
}
trap cleanup EXIT INT TERM

echo "[INFO] Starting FastAPI backend on http://0.0.0.0:${BACKEND_PORT}"
(
  cd "${FASTAPI_DIR}"
  uvicorn app.main:app --host 0.0.0.0 --port "${BACKEND_PORT}" --reload
) &
BACKEND_PID=$!

echo "[INFO] Starting Frontend static server on http://0.0.0.0:${FRONTEND_PORT}"
python3 -m http.server "${FRONTEND_PORT}" --directory "${ROOT_DIR}/public" &


FRONTEND_PID=$!

wait -n "${BACKEND_PID}" "${FRONTEND_PID}"
