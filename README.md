# clip.opus.pro

Минимальный MVP-сервис для публикации текстовых клипов по короткой ссылке.

## Возможности
- Создание клипа (текст + опциональное время жизни в минутах).
- Просмотр клипа по короткому идентификатору.
- Защита от слишком больших клипов (до 10_000 символов).
- Хранение в SQLite.
- Простой веб-интерфейс (главная + страница клипа).
- JSON API для интеграций.

## Локальный запуск

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn clip_service.app:app --reload --host 0.0.0.0 --port 8000
```

После старта открой `http://localhost:8000`.

Проверка доступности: `GET /health` возвращает `{"status":"ok"}`.

## API

### Создать клип
`POST /api/clips`

Пример тела:

```json
{
  "content": "hello clip.opus.pro",
  "ttl_minutes": 60
}
```

Ответ:

```json
{
  "id": "a1B2c3",
  "url": "http://localhost:8000/c/a1B2c3",
  "expires_at": "2026-01-01T12:00:00Z"
}
```

### Получить клип
`GET /api/clips/{clip_id}`

## Тесты

```bash
pytest -q
```
