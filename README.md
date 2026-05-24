# ResearchFlow

A full-stack AI research assistant built with FastAPI and React. Upload any research paper as a PDF, ask questions in plain English, and get answers cited by page number.

ResearchFlow uses a confidence scoring system to decide — per query — whether the document has enough context to answer. If confidence is low, it automatically falls back to live web search via Tavily, and clearly labels every response with its source (document or web).

---

## How it works

1. Upload a PDF → text is chunked and embedded using `sentence-transformers`
2. Ask a question → ChromaDB finds the most semantically relevant chunks
3. Confidence is scored using L2 embedding distance
4. If confidence is high → Groq LLM answers from the document with `[Page X]` citations
5. If confidence is low → Tavily searches the web, same response format
6. Full conversation history is sent to the LLM on every turn, so follow-up questions work naturally

---

## Features

- Semantic PDF search with page citations
- Confidence-based hybrid routing (document → web fallback)
- Multi-turn conversation memory
- Ethics enforcement — refuses harmful or hateful requests
- Session sidebar with auto-naming, rename, delete, and history persistence
- PDF export — AI-generated summary + full cited chat transcript
- Dark / light mode, collapsible sidebar
- Archie — a charcoal owl mascot that reacts to cursor proximity

---

## Stack

| | |
|---|---|
| Backend | Python, FastAPI, PyMuPDF |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) |
| Vector DB | ChromaDB |
| LLM | Groq API — Llama 3.3 70B |
| Web Search | Tavily API |
| Frontend | React, Vite |
| Export | jsPDF |

---

## Running locally

```bash
# Backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn pymupdf chromadb sentence-transformers groq tavily-python python-multipart python-dotenv

# Add to .env
GROQ_API_KEY=your_key
TAVILY_API_KEY=your_key

uvicorn backend.main:app --reload

# Frontend (separate terminal)
cd frontend && npm install

# Add to frontend/.env
VITE_GROQ_API_KEY=your_key

npm run dev
```

---

## Deployment

Planned: AWS EC2 (backend) + Vercel (frontend) + MongoDB (session storage)
