import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import health, auth, complaints, routes, admin, bins, vehicles

# Ensure database tables exist and are seeded
Base.metadata.create_all(bind=engine)
_init_db = SessionLocal()
try:
    seed_database(_init_db)
finally:
    _init_db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is up-to-date
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="EcoRoute AI — Cloud Smart Waste Management API",
    description="A Scalable Cloud-Based Smart Waste Management and Collection Optimization Platform (ABA for Cloud).",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.web\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure local uploads directory exists and mount static route
os.makedirs(settings.LOCAL_UPLOAD_DIR, exist_ok=True)
app.mount("/api/v1/uploads", StaticFiles(directory=settings.LOCAL_UPLOAD_DIR), name="uploads")

# Include Modular Routers
app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(complaints.router, prefix="/api/v1")
app.include_router(routes.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(bins.router, prefix="/api/v1")
app.include_router(vehicles.router, prefix="/api/v1")


@app.get("/")
def root_endpoint():
    return {
        "project": "EcoRoute AI: A Scalable Cloud-Based Smart Waste Management and Collection Optimization System",
        "assignment": "ABA for Cloud",
        "platform": "Amazon Web Services (AWS)",
        "sdg_alignment": "SDG 11 — Target 11.6 & 11.3",
        "status": "operational",
        "docs_url": "/docs",
        "health_check": "/health"
    }
