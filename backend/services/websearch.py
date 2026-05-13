import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_web(query: str) -> list[dict]:
    results = client.search(query=query, max_results=4)
    return [
        {
            "text": r["content"],
            "url": r["url"],
            "page": "web"
        }
        for r in results.get("results", [])
    ]