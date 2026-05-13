# ResearchFlow

Hybrid Research Assistant with Citation-Aware RAG + Web Search

ResearchFlow is a full-stack AI research assistant that lets users upload research papers or documents and chat with them using natural language. The system provides answers with exact page citations and intelligently expands beyond the document when additional context is needed.

Unlike traditional RAG systems that are restricted to uploaded files, ResearchFlow treats the document as the starting point — not the boundary. When the uploaded paper lacks enough context, the system automatically performs web search augmentation and clearly labels every source used in the final response.

---

## Core Differentiator

Most document-chat systems only retrieve information from uploaded content. ResearchFlow combines:

* Retrieval-Augmented Generation (RAG)
* Confidence-aware source routing
* Real-time web search augmentation
* Multi-document comparison
* Citation-aware responses

This enables the assistant to:

* answer directly from uploaded papers
* detect insufficient document context
* supplement answers with external research
* clearly separate paper-derived vs web-derived information

---

## Features

### Document Mode

* Answers strictly from uploaded documents
* Exact page number citations
* Citation labels like:

  ```
  [From Paper: Page 12]
  ```

### Hybrid Mode

* Retrieves from uploaded papers first
* Uses confidence scoring to detect weak context
* Automatically triggers web search when necessary
* Clearly labels all sources

### Explore Mode

* No uploaded document required
* Pure web-based research assistant
* Finds related papers and summarizes topics
* Suggests follow-up questions automatically

### Multi-Paper Comparison

* Upload multiple research papers simultaneously
* Compare methodologies, results, and findings
* Separate vector stores per paper
* Cross-paper retrieval and synthesis

### Conversation History

* Persistent chat sessions
* Resume previous conversations
* PostgreSQL-backed history storage

### Export Chat as Notes

* Export conversations as Markdown
* Optional PDF export support
* Includes timestamps and citations

---

## Tech Stack

### Frontend

* React
* TailwindCSS

### Backend

* FastAPI
* LangChain

### AI / ML

* Gemini API
* HuggingFace Embeddings
* ChromaDB Vector Store

### Database & Storage

* PostgreSQL
* AWS S3

### Research & Search

* Tavily API
* PyMuPDF

---

## Project Goal

ResearchFlow aims to bridge the gap between:

* closed-document RAG systems
* web-based research assistants

by creating a hybrid assistant capable of:

1. understanding uploaded documents deeply
2. expanding beyond them intelligently
3. maintaining transparent source attribution throughout the response pipeline

---

---

# System Architecture

ResearchFlow follows a hybrid full-stack architecture consisting of:

1. React frontend
2. FastAPI backend
3. External AI/search/storage services

The system combines document-based retrieval with live web augmentation to create citation-aware research responses.

---

## Architecture Flow

```text
User
  ↓
React Frontend
  (chat UI, upload, mode toggle, history sidebar)
  ↓
FastAPI Backend
  ├── PDF Parsing (PyMuPDF)
  ├── Embedding Generation (HuggingFace)
  ├── ChromaDB Vector Store
  ├── LangChain Retrieval Pipeline
  ├── Gemini API Response Generation
  ├── Tavily Web Search Integration
  ├── Multi-Paper Retrieval Manager
  ├── PostgreSQL Session Storage
  └── Export Engine
  ↓
Citation-aware Response
```

---

## Backend Workflow

### 1. Document Upload

* User uploads one or more research papers
* PDFs are parsed using PyMuPDF
* Text is chunked by semantic sections/paragraphs

### 2. Embedding Generation

* Chunks are converted into embeddings using HuggingFace models
* Embeddings are stored in ChromaDB

### 3. Retrieval Pipeline

* User query retrieves top relevant chunks
* Similarity scores determine retrieval confidence

### 4. Confidence-Based Routing

If document confidence is low:

* Tavily web search is triggered automatically
* External sources supplement the response

### 5. Final Response Generation

Gemini API generates:

* citation-aware responses
* source-separated reasoning
* structured research answers

---

# Folder Structure

```text
researchflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── UploadPanel.jsx
│   │   │   ├── HistorySidebar.jsx
│   │   │   ├── MetadataCard.jsx
│   │   │   ├── ModeToggle.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── upload.py
│   │   ├── chat.py
│   │   ├── sessions.py
│   │   └── export.py
│   ├── services/
│   │   ├── embeddings.py
│   │   ├── vectorstore.py
│   │   ├── rag.py
│   │   ├── llm.py
│   │   ├── websearch.py
│   │   └── confidence.py
│   ├── models/
│   │   └── schemas.py
│   ├── db/
│   │   └── database.py
│   └── requirements.txt
│
├── README.md
└── .env.example
```

---

# Environment Variables

Create a `.env` file in the backend directory:

```env
GOOGLE_API_KEY=your_gemini_key
TAVILY_API_KEY=your_tavily_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=researchflow-pdfs
DATABASE_URL=postgresql://user:pass@host/dbname
```

---

# Current Development Focus

The current implementation focus includes:

* robust RAG retrieval
* confidence-aware web augmentation
* multi-document querying
* transparent citation handling
* persistent research workflows

---

---

# Development Roadmap

## Week 1 — Backend Foundation

### Goals

* Set up FastAPI backend architecture
* Implement PDF upload and parsing
* Build embedding + vector store pipeline

### Tasks

* FastAPI project setup
* PDF upload endpoint
* Text extraction using PyMuPDF
* Semantic chunking strategy
* HuggingFace embeddings integration
* ChromaDB ingestion pipeline
* PostgreSQL schema setup
* Session CRUD endpoints
* AWS S3 integration for document storage

---

## Week 2 — RAG + Multi-Paper Retrieval

### Goals

* Build hybrid retrieval pipeline
* Add confidence-aware web augmentation
* Support multi-document querying

### Tasks

* LangChain retrieval chain
* Gemini API integration
* Citation-aware prompting
* Confidence scoring logic
* Tavily API integration
* Web augmentation pipeline
* Multi-vectorstore management
* Cross-document retrieval synthesis

---

## Week 3 — Frontend + User Experience

### Goals

* Build interactive research workflow UI
* Improve usability and research productivity

### Tasks

* React chat interface
* Mode switching (Document / Hybrid / Explore)
* Multi-file upload support
* Conversation history sidebar
* Metadata extraction cards
* Follow-up question suggestions
* Markdown/PDF export system
* Citation-aware source display

---

## Week 4 — Deployment + Polish

### Goals

* Production deployment
* Error handling
* Final optimization and testing

### Tasks

* Deploy backend on AWS EC2
* Deploy frontend on Vercel
* Add loading/error states
* Improve edge-case handling
* Create demo walkthrough
* End-to-end testing
* Final README polish

---

# Core Technical Components

## Confidence-Based Source Routing

ResearchFlow dynamically decides whether:

* the uploaded document has sufficient context
* or external web retrieval is required

This prevents hallucinated answers when the document context is weak.

### Example Logic

```python
def should_search_web(retrieval_score: float,
                      threshold: float = 0.75) -> bool:
    return retrieval_score < threshold
```

If the retrieval similarity score falls below the threshold:

* web search augmentation is triggered automatically

---

## Multi-Paper Retrieval

Each uploaded paper gets:

* its own isolated vector store
* independent embeddings
* separate citation tracking

This enables structured cross-paper comparison.

### Example Retrieval Logic

```python
def query_all_papers(question: str,
                     paper_ids: list[str]) -> list[dict]:

    results = []

    for pid in paper_ids:
        store = load_vectorstore(pid)

        chunks = store.similarity_search(question, k=3)

        results.extend([
            {
                'paper': pid,
                'content': c.page_content,
                'page': c.metadata['page']
            }
            for c in chunks
        ])

    return results
```

---

# Planned Enhancements

Future improvements may include:

* Streaming responses
* Research graph visualization
* Citation export formats (BibTeX/APA)
* OCR support for scanned papers
* Collaborative workspaces
* Voice-based querying
* Local LLM support
* Research recommendation engine

---

# Design Philosophy

ResearchFlow is designed around three principles:

### 1. Transparency

Every answer should clearly show:

* where information came from
* whether it originated from papers or the web

### 2. Expandability

Documents should act as:

* the starting point of research
* not the limit of available knowledge

### 3. Research Productivity

The system should help users:

* explore ideas faster
* compare sources efficiently
* generate usable research notes

