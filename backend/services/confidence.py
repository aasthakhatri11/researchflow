# Threshold below which we fall back to web search
CONFIDENCE_THRESHOLD = 0.1

def score_confidence(search_results: list[dict]) -> float:
    """
    ChromaDB returns L2 distances — lower means closer match.
    We convert to a 0-1 confidence score where 1 = very confident.
    """
    if not search_results:
        return 0.0

    distances = [r["distance"] for r in search_results]
    avg_distance = sum(distances) / len(distances)

    # Normalize: distance 0 = confidence 1, distance 2 = confidence 0
    confidence = max(0.0, 1.0 - (avg_distance / 2.0))
    return round(confidence, 3)

def should_use_web(confidence: float) -> bool:
    return confidence < CONFIDENCE_THRESHOLD