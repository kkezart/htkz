# Backend (FastAPI)

## Running locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment
- No external data sources are wired for MVP.
- Mock trend data is generated in `app/data/mock_data.py`.
