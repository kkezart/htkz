#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/root/htkz"
BRANCH="codex/design-mvp-for-ai-video-director"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root (sudo)."
  exit 1
fi

if [[ ! -d "${APP_ROOT}/.git" ]]; then
  echo "Expected ${APP_ROOT} to be a git repository. Clone the repo first."
  exit 1
fi

cd "${APP_ROOT}"
git fetch origin
git checkout "${BRANCH}"
git pull origin "${BRANCH}"

cd "${APP_ROOT}/backend"
if [[ ! -d ".venv" ]]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt

cd "${APP_ROOT}/frontend"
npm install

systemctl restart htkz-backend htkz-frontend
echo "Updated to latest ${BRANCH} and restarted services."
