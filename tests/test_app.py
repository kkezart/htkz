from fastapi.testclient import TestClient

from clip_service.app import app
from clip_service.storage import DB_PATH, init_db


def setup_function() -> None:
    if DB_PATH.exists():
        DB_PATH.unlink()
    init_db()


def test_healthcheck_available() -> None:
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_read_clip_api() -> None:
    client = TestClient(app)

    create = client.post("/api/clips", json={"content": "hello world", "ttl_minutes": 5})
    assert create.status_code == 200
    payload = create.json()
    assert payload["id"]
    assert payload["url"].endswith(f"/c/{payload['id']}")

    read = client.get(f"/api/clips/{payload['id']}")
    assert read.status_code == 200
    assert read.json()["content"] == "hello world"


def test_home_page_renders() -> None:
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "clip.opus.pro" in response.text


def test_form_submit_works() -> None:
    client = TestClient(app)
    response = client.post("/", data={"content": "from form", "ttl_minutes": "10"})
    assert response.status_code == 200
    assert "Клип создан" in response.text
