from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Generator

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.getenv("CLIP_DB_PATH", str(BASE_DIR / "clips.db")))


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


@contextmanager
def get_conn() -> Generator[sqlite3.Connection, None, None]:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS clips (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT
            )
            """
        )


def save_clip(clip_id: str, content: str, ttl_minutes: int | None) -> str | None:
    created = utc_now()
    expires_at: datetime | None = None
    if ttl_minutes is not None:
        expires_at = created + timedelta(minutes=ttl_minutes)

    with get_conn() as conn:
        conn.execute(
            "INSERT INTO clips (id, content, created_at, expires_at) VALUES (?, ?, ?, ?)",
            (
                clip_id,
                content,
                created.isoformat(),
                expires_at.isoformat() if expires_at else None,
            ),
        )

    return expires_at.isoformat().replace("+00:00", "Z") if expires_at else None


def get_clip(clip_id: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, content, created_at, expires_at FROM clips WHERE id = ?",
            (clip_id,),
        ).fetchone()

    if row is None:
        return None

    expires_at = row["expires_at"]
    if expires_at:
        exp = datetime.fromisoformat(expires_at)
        if exp < utc_now():
            delete_clip(clip_id)
            return None

    return {
        "id": row["id"],
        "content": row["content"],
        "created_at": row["created_at"],
        "expires_at": row["expires_at"],
    }


def delete_clip(clip_id: str) -> None:
    with get_conn() as conn:
        conn.execute("DELETE FROM clips WHERE id = ?", (clip_id,))
