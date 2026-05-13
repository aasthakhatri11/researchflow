from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.vectorstore import search_chunks
from backend.services.llm import generate_answer

router = APIRouter()

# Defines the shape of the incoming request
class ChatRequest(BaseModel):
    session_id: str
    query: str

@router.post("/chat")
def chat(request: ChatRequest):
    # Find the most relevant chunks for this query
    chunks = search_chunks(request.session_id, request.query)

    if not chunks:
        raise HTTPException(status_code=404, detail="No content found for this session")

    # Generate answer using Gemini
    result = generate_answer(chunks, request.query)

    return {
        "session_id": request.session_id,
        "query": request.query,
        "answer": result["answer"],
        "sources": result["sources"]
    }