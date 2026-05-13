import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def generate_answer(chunks: list[dict], query: str) -> dict:
    # Build context from retrieved chunks with page numbers
    context = "\n\n".join([
        f"[Page {c['page']}]: {c['text']}"
        for c in chunks
    ])

    prompt = f"""You are a research assistant. Answer the question using ONLY the context below.
For every claim you make, cite it as [Page X].
If the context doesn't contain the answer, say "I couldn't find this in the document."

Context:
{context}

Question: {query}

Answer:"""

    response = model.generate_content(prompt)
    return {
        "answer": response.text,
        "sources": list(set([f"Page {c['page']}" for c in chunks]))
    }