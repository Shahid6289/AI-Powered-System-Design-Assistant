from fastapi import APIRouter
from app.config import settings

router = APIRouter()

router.get("/health")
async def health():
    return {"status": "healthy", "service": "ai-service", "backend": settings.MODEL_BACKEND}
