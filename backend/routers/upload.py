import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.parser import extract_chunks

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # creates uploads/ folder if it doesn't exist

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    # Give the file a unique name so uploads don't overwrite each other
    session_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{session_id}.pdf"

    # Save the uploaded file to disk
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text chunks from the PDF
    chunks = extract_chunks(file_path)

    return {
        "session_id": session_id,
        "filename": file.filename,
        "chunks_extracted": len(chunks),
        "preview": chunks[:2]  # return first 2 chunks so we can verify it's working
    }