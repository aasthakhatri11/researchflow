import json
import os
import datetime

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
    data[session_id] = {
        "filename": filename,
        "name": None,
        "created_at": str(datetime.datetime.now()),
        "messages": []
    }
    _save(data)

def get_session(session_id: str) -> dict | None:
    data = _load()
    return data.get(session_id)

def list_sessions() -> list[dict]:
    data = _load()
    # Most recent first
    sessions = [{"session_id": k, **v} for k, v in data.items()]
    return sorted(sessions, key=lambda x: x["created_at"], reverse=True)

def add_message(session_id: str, role: str, content: str, meta: dict = {}):
    data = _load()
    if session_id not in data:
        return
    data[session_id]["messages"].append({
        "role": role,
        "content": content,
        "meta": meta
    })
    _save(data)

def set_name(session_id: str, name: str):
    data = _load()
    if session_id not in data:
        return
    data[session_id]["name"] = name
    _save(data)

def delete_session(session_id: str):
    data = _load()
    if session_id in data:
        del data[session_id]
        _save(data)