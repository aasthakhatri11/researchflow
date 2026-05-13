import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.parser import extract_chunks
from backend.services.vectorstore import store_chunks
from backend.services.sessions import create_session

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    session_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{session_id}.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    chunks = extract_chunks(file_path)
    store_chunks(session_id, chunks)
    create_session(session_id, file.filename)  # persist session

    return {
        "session_id": session_id,
        "filename": file.filename,
        "chunks_extracted": len(chunks),
    }