from __future__ import annotations

import secrets
import string
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field, ValidationError

from clip_service.storage import get_clip, init_db, save_clip

BASE_DIR = Path(__file__).resolve().parent


class CreateClipRequest(BaseModel):
    content: str = Field(min_length=1, max_length=10_000)
    ttl_minutes: int | None = Field(default=None, ge=1, le=60 * 24 * 7)


class CreateClipResponse(BaseModel):
    id: str
    url: str
    expires_at: str | None


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="clip.opus.pro", version="0.2.0", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def new_id(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def home(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "index.html", {"created_url": None, "error": None, "expires_at": None})


@app.post("/", response_class=HTMLResponse)
async def create_from_form(request: Request) -> HTMLResponse:
    form = await request.form()
    content = (form.get("content") or "").strip()
    ttl_raw = (form.get("ttl_minutes") or "").strip()

    ttl: int | None = None
    if ttl_raw:
        try:
            ttl = int(ttl_raw)
        except ValueError:
            return templates.TemplateResponse(
                request,
                "index.html",
                {"created_url": None, "error": "TTL должен быть числом", "expires_at": None},
                status_code=400,
            )

    try:
        payload = CreateClipRequest(content=content, ttl_minutes=ttl)
    except ValidationError:
        return templates.TemplateResponse(
            request,
            "index.html",
            {"created_url": None, "error": "Проверьте корректность полей формы", "expires_at": None},
            status_code=400,
        )

    clip_id = new_id()
    expires_at = save_clip(clip_id, payload.content, payload.ttl_minutes)
    url = str(request.base_url).rstrip("/") + f"/c/{clip_id}"

    return templates.TemplateResponse(request, "index.html", {"created_url": url, "error": None, "expires_at": expires_at})


@app.post("/api/clips", response_model=CreateClipResponse)
def create_clip(request: Request, body: CreateClipRequest) -> CreateClipResponse:
    clip_id = new_id()
    expires_at = save_clip(clip_id, body.content, body.ttl_minutes)
    url = str(request.base_url).rstrip("/") + f"/c/{clip_id}"
    return CreateClipResponse(id=clip_id, url=url, expires_at=expires_at)


@app.get("/api/clips/{clip_id}")
def read_clip(clip_id: str) -> dict:
    clip = get_clip(clip_id)
    if clip is None:
        raise HTTPException(status_code=404, detail="Clip not found or expired")

    expires_at = clip["expires_at"]
    if expires_at:
        expires_at = datetime.fromisoformat(expires_at).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")

    return {
        "id": clip["id"],
        "content": clip["content"],
        "created_at": datetime.fromisoformat(clip["created_at"]).astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "expires_at": expires_at,
    }


@app.get("/c/{clip_id}", response_class=HTMLResponse)
def view_clip(request: Request, clip_id: str) -> HTMLResponse:
    clip = get_clip(clip_id)
    if clip is None:
        raise HTTPException(status_code=404, detail="Clip not found or expired")

    return templates.TemplateResponse(
        request,
        "clip.html",
        {
            "clip_id": clip_id,
            "content": clip["content"],
            "created_at": clip["created_at"],
            "expires_at": clip["expires_at"],
        },
    )
