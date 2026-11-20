import os
from datetime import datetime
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import get_db
from ..config import settings

router = APIRouter(tags=["Health & Monitoring"])

@router.get("/health", status_code=status.HTTP_200_OK)
def health_check(response: Response, db: Session = Depends(get_db)):
    """
    Application Load Balancer (ALB) health check endpoint.
    Performs active ping against database and returns system status.
    """
    health_status = {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat(),
        "storage_backend": settings.STORAGE_BACKEND,
        "database": "unknown"
    }

    try:
        db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception as e:
        health_status["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return health_status
