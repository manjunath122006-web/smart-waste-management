import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "EcoRoute AI")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
        ).split(",") if origin.strip()
    ]

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ecoroute.db")
    
    # Storage
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")  # "local" or "s3"
    LOCAL_UPLOAD_DIR: str = os.getenv("LOCAL_UPLOAD_DIR", "./uploads")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "ecoroute-waste-photos")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")

    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-dev-key-change-in-production-min-32-chars")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@ecoroute.local")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminSecurePass123!")

    # Municipal Depot Default Location (e.g. Bangalore Central coordinates)
    DEPOT_LATITUDE: float = float(os.getenv("DEPOT_LATITUDE", "12.9716"))
    DEPOT_LONGITUDE: float = float(os.getenv("DEPOT_LONGITUDE", "77.5946"))
    DEPOT_NAME: str = os.getenv("DEPOT_NAME", "Central Municipal Waste Depot")

settings = Settings()
