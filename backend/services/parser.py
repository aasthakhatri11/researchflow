import fitz  # PyMuPDF

CHUNK_SIZE = 500  # max characters per chunk

def extract_chunks(pdf_path: str) -> list[dict]:
    doc = fitz.open(pdf_path)
    chunks = []

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        
        # Split by paragraph first
        paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50]
        
        # If no paragraphs found, treat whole page as one chunk
        if not paragraphs:
            paragraphs = [text]

        for para in paragraphs:
            # If paragraph is too long, split it into smaller chunks
            for i in range(0, len(para), CHUNK_SIZE):
                chunk = para[i:i + CHUNK_SIZE].strip()
                if chunk:
                    chunks.append({"text": chunk, "page": page_num})

    return chunks