from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.upload import router as upload_router
from backend.routers.chat import router as chat_router

app = FastAPI(title="ResearchFlow API")

# Allows frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "ok", "message": "ResearchFlow is running"}