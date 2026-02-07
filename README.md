# AI Short-Form Video Director (MVP)

## Architecture overview
- **Frontend**: React + Vite SPA for the MVP UX flows.
- **Backend**: FastAPI service that mocks trend ingestion, clustering, and script generation.
- **Future**: Swap mock data with a trend ingestion pipeline + analytics store.

## One-command run (Docker)
```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/health

## VPS Timeweb (clean install from scratch)
These steps are for a **fresh Ubuntu VPS** and assume you are running commands **after SSH login on the server**.

### 1) Connect to the server
From your local machine (Windows/Mac/Linux):
```bash
ssh root@YOUR_SERVER_IP
```
You should see a prompt like `root@...#`. All commands below run **on the server**.

### 2) Install system dependencies on the server
```bash
apt update -y
apt install -y git python3-venv python3-pip nodejs npm
```

### 3) Clone the project on the server
```bash
cd /root
rm -rf htkz
git clone https://github.com/kkezart/htkz.git
ls /root/htkz
```
You should see: `backend`, `frontend`, `README.md`, `docker-compose.yml`, etc.

### 4) Start the backend (FastAPI)
```bash
cd /root/htkz/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Leave this terminal running.

### 5) Start the frontend (Vite) in a second SSH session
Open a **second SSH connection** and run:
```bash
cd /root/htkz/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 6) Open in the browser
- Frontend: `http://YOUR_SERVER_IP:5173`
- Backend health: `http://YOUR_SERVER_IP:8000/health`

### Common mistakes (quick check)
- **Running Linux paths in PowerShell**: `/root/...` only exists on the server, not on Windows.
- **No output from `ls /root/htkz`**: clone did not finish or wrong directory.
- **Running `pip install` in the repo root**: `requirements.txt` is in `/root/htkz/backend`.

## API design (MVP)
| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| POST | `/api/v1/trends/by-topic` | Analyze trends for a topic + generate one script |
| POST | `/api/v1/trends/by-account` | Analyze account + generate one script |

## Data models (MVP)
- **TrendVideo**: id, url, caption, metrics (views_24h, engagements_24h, duration_seconds, hook_type, structure, visual_patterns)
- **PatternCluster**: id, summary, top_hooks, top_structures, visual_patterns
- **ScriptOutput**: storyboard, spoken_script, hook_options, patterns_used

## Frontend structure
- `src/App.tsx`: MVP UI with the two input flows + output sections.
- `src/components/Storyboard.tsx`: timeline storyboard view.
- `src/components/Teleprompter.tsx`: camera mode with timed segments.

## MVP scope boundaries
**Implemented now**
- Mock trend retrieval and clustering
- Script generation with storyboard + hooks
- Teleprompter-style camera mode

**Future**
- Real-time data ingestion from platforms
- Similar account discovery
- Collaboration, exports, and scheduling
