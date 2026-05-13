import chromadb
from sentence_transformers import SentenceTransformer

# Load the embedding model — converts text into numbers ChromaDB can search
model = SentenceTransformer("all-MiniLM-L6-v2")

# Persistent client saves embeddings to disk so they survive server restarts
client = chromadb.PersistentClient(path="./chroma_db")

def store_chunks(session_id: str, chunks: list[dict]):
    collection = client.get_or_create_collection(session_id)
    
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts).tolist()
    ids = [f"{session_id}_{i}" for i in range(len(chunks))]
    metadatas = [{"page": c["page"]} for c in chunks]

    collection.add(documents=texts, embeddings=embeddings, ids=ids, metadatas=metadatas)
    return len(chunks)

def search_chunks(session_id: str, query: str, n: int = 5) -> list[dict]:
    collection = client.get_collection(session_id)
    
    query_embedding = model.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=n)

    # Format results into a clean list
    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        chunks.append({
            "text": doc,
            "page": results["metadatas"][0][i]["page"],
            "distance": results["distances"][0][i]
        })
    return chunks