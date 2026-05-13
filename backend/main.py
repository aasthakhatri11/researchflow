from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.upload import router as upload_router

app = FastAPI(title="ResearchFlow API")

# Allows frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")

@app.get("/")
def health():
    return {"status": "ok", "message": "ResearchFlow is running"}