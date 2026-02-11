#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${ROOT_DIR}/.venv"
REQ_FILE="${ROOT_DIR}/backend/requirements.txt"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERROR] python3 is required but not installed." >&2
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

echo "[INFO] Installing backend dependencies"
pip install --upgrade pip >/dev/null
pip install -r "${REQ_FILE}" >/dev/null

if [[ -z "${DATABASE_URL:-}" ]]; then
  export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/kegtest'
  echo "[INFO] DATABASE_URL not set. Using default: ${DATABASE_URL}"
fi

echo "[INFO] Starting FastAPI backend on http://0.0.0.0:3000"
exec uvicorn backend.main:app --host 0.0.0.0 --port 3000 --reload
