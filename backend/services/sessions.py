import json
import os

SESSIONS_FILE = "sessions.json"

def _load() -> dict:
    if not os.path.exists(SESSIONS_FILE):
        return {}
    with open(SESSIONS_FILE, "r") as f:
        return json.load(f)

def _save(data: dict):
    with open(SESSIONS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def create_session(session_id: str, filename: str):
    data = _load()
    data[session_id] = {"filename": filename, "created_at": str(__import__("datetime").datetime.now())}
    _save(data)

def get_session(session_id: str) -> dict | None:
    data = _load()
    return data.get(session_id)

def list_sessions() -> list[dict]:
    data = _load()
    return [{"session_id": k, **v} for k, v in data.items()]