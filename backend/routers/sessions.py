from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.sessions import get_session, list_sessions, set_name, delete_session

router = APIRouter()

class RenameRequest(BaseModel):
    name: str

@router.get("/sessions")
def get_all_sessions():
    return list_sessions()

@router.get("/sessions/{session_id}")
def get_one_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.patch("/sessions/{session_id}/rename")
def rename_session(session_id: str, body: RenameRequest):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    set_name(session_id, body.name.strip())
    return {"ok": True}

@router.delete("/sessions/{session_id}")
def remove_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    delete_session(session_id)
    return {"ok": True}