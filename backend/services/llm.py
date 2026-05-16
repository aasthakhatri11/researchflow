import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_answer(chunks: list[dict], query: str) -> dict:
    context = "\n\n".join([
        f"[Page {c['page']}]: {c['text']}"
        for c in chunks
    ])

    prompt = f"""You are a research assistant helping users understand a document.
Answer the question based on the context below. Be helpful and synthesize the information naturally.
For every claim you make, cite it as [Page X].
Only say "I couldn't find this in the document" if the context has absolutely no relevant information.

Context:
{context}

Question: {query}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": list(set([f"Page {c['page']}" for c in chunks]))
    }