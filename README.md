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
