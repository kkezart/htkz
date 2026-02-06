from fastapi import FastAPI

from app.schemas import AccountRequest, TopicRequest, TrendResponse
from app.services.trend_analysis import analyze_account, analyze_trends

app = FastAPI(title="AI Short-Form Video Director API")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/v1/trends/by-topic", response_model=TrendResponse)
def trends_by_topic(payload: TopicRequest) -> TrendResponse:
    return analyze_trends(payload.topic, payload.platform, payload.region)


@app.post("/api/v1/trends/by-account", response_model=TrendResponse)
def trends_by_account(payload: AccountRequest) -> TrendResponse:
    return analyze_account(payload.account, payload.platform, payload.region)
