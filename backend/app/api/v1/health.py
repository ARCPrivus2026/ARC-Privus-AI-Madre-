"""
Health check endpoints for ARC Privus AI Madre
"""
from fastapi import APIRouter
from typing import Dict
import psutil
import time

router = APIRouter()

start_time = time.time()


@router.get("/status")
async def get_health_status() -> Dict:
    """
    Get detailed health status of the system
    
    Returns:
        Dictionary with system health metrics
    """
    uptime = time.time() - start_time
    
    return {
        "status": "healthy",
        "uptime_seconds": uptime,
        "system": {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent
        }
    }


@router.get("/ping")
async def ping() -> Dict:
    """
    Simple ping endpoint for quick health checks
    
    Returns:
        Pong response
    """
    return {"message": "pong"}
