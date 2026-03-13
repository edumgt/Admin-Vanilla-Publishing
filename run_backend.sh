#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FASTAPI_DIR="${ROOT_DIR}/backend_fastapi"
VENV_DIR="${ROOT_DIR}/.venv"
REQ_FILE="${FASTAPI_DIR}/requirements.txt"
BACKEND_PORT="${BACKEND_PORT:-8000}"
APP_ENV="${APP_ENV:-development}"
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

echo "[INFO] Waiting for PostgreSQL readiness"
python3 - <<'PY'
import os
import time

from sqlalchemy import create_engine, text

database_url = os.environ["DATABASE_URL"]
deadline = time.time() + 60
last_error = None

while time.time() < deadline:
    try:
        engine = create_engine(database_url, pool_pre_ping=True)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("[INFO] PostgreSQL is ready")
        break
    except Exception as exc:  # pragma: no cover - shell bootstrap
        last_error = exc
        time.sleep(2)
else:
    raise SystemExit(f"[ERROR] Database readiness check failed: {last_error}")
PY

UVICORN_ARGS=(app.main:app --host 0.0.0.0 --port "${BACKEND_PORT}")
if [[ "${APP_ENV}" == "development" ]]; then
  UVICORN_ARGS+=(--reload)
fi

echo "[INFO] Starting unified API + static frontend on http://0.0.0.0:${BACKEND_PORT}"
echo "[INFO] APP_ENV=${APP_ENV}"
echo "[INFO] Main page: http://localhost:${BACKEND_PORT}/"
echo "[INFO] Blue Marble: http://localhost:${BACKEND_PORT}/burumable.html"

cd "${FASTAPI_DIR}"
exec uvicorn "${UVICORN_ARGS[@]}"
