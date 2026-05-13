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
