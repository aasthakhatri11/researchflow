from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.vectorstore import search_chunks
from backend.services.confidence import score_confidence, should_use_web
from backend.services.websearch import search_web
from backend.services.llm import generate_answer

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

    result = generate_answer(chunks, request.query)

    return {
        "session_id": request.session_id,
        "query": request.query,
        "confidence": round(confidence, 3),
        "source": source,
        "answer": result["answer"],
        "sources": result["sources"]
    }