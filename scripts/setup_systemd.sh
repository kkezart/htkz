#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/root/htkz"
BACKEND_SERVICE="htkz-backend"
FRONTEND_SERVICE="htkz-frontend"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root (sudo)."
  exit 1
fi

if [[ ! -d "${APP_ROOT}/backend" ]]; then
  echo "Expected ${APP_ROOT}/backend to exist. Clone the repo first."
  exit 1
fi

cat > /etc/systemd/system/${BACKEND_SERVICE}.service <<EOF
[Unit]
Description=HTKZ Backend
After=network.target

[Service]
WorkingDirectory=${APP_ROOT}/backend
ExecStart=${APP_ROOT}/backend/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/${FRONTEND_SERVICE}.service <<EOF
[Unit]
Description=HTKZ Frontend
After=network.target

[Service]
WorkingDirectory=${APP_ROOT}/frontend
ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0 --port 5173
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${BACKEND_SERVICE} ${FRONTEND_SERVICE}
systemctl restart ${BACKEND_SERVICE} ${FRONTEND_SERVICE}

echo "Services started:"
systemctl --no-pager --full status ${BACKEND_SERVICE} ${FRONTEND_SERVICE}
