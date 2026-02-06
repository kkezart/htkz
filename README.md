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
