from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.vectorstore import search_chunks
from backend.services.confidence import score_confidence, should_use_web
from backend.services.websearch import search_web
from backend.services.llm import generate_answer
from backend.services.sessions import add_message, set_name, get_session

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    query: str

@router.post("/chat")
def chat(request: ChatRequest):
    chunks = search_chunks(request.session_id, request.query)

    if not chunks:
        raise HTTPException(status_code=404, detail="No content found for this session")

    confidence = score_confidence(chunks)
    source = "document"

    if should_use_web(confidence):
        web_results = search_web(request.query)
        chunks = web_results
        source = "web"

    # Read history BEFORE generating so the LLM has full conversation context
    session = get_session(request.session_id)
    history = session.get("messages", []) if session else []

    result = generate_answer(chunks, request.query, history)

    # Auto-name from first question
    if session and session.get("name") is None:
        auto_name = request.query[:40] + ("..." if len(request.query) > 40 else "")
        set_name(request.session_id, auto_name)

    add_message(request.session_id, "user", request.query)
    add_message(request.session_id, "assistant", result["answer"], meta={
        "confidence": round(confidence, 3),
        "source": source,
        "sources": result["sources"]
    })

    return {
        "session_id": request.session_id,
        "query": request.query,
        "confidence": round(confidence, 3),
        "source": source,
        "answer": result["answer"],
        "sources": result["sources"]
    }