from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.vectorstore import search_chunks
from backend.services.confidence import score_confidence, should_use_web
from backend.services.websearch import search_web

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    query: str

@router.post("/chat")
def chat(request: ChatRequest):
    # Search the document
    chunks = search_chunks(request.session_id, request.query)

    if not chunks:
        raise HTTPException(status_code=404, detail="No content found for this session")

    # Score how confident we are in the document results
    confidence = score_confidence(chunks)
    source = "document"

    # If confidence is low, fall back to web search
    if should_use_web(confidence):
        web_results = search_web(request.query)
        chunks = web_results
        source = "web"

    return {
        "session_id": request.session_id,
        "query": request.query,
        "confidence": confidence,
        "source": source,
        "chunks_found": len(chunks),
        "preview": chunks[:2]
    }