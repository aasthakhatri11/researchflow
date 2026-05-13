from fastapi import APIRouter, HTTPException
from backend.services.sessions import get_session, list_sessions

router = APIRouter()

@router.get("/sessions")
def get_all_sessions():
    return list_sessions()

@router.get("/sessions/{session_id}")
def get_one_session(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session