"""
API v1 router aggregation
"""
from fastapi import APIRouter
from app.api.v1 import ai, health, auth

router = APIRouter()

# Include sub-routers
router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(ai.router, prefix="/ai", tags=["AI Services"])
