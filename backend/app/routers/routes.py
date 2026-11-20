from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Complaint, CollectionRoute, RouteStop, User
from ..schemas import RouteOptimizationRequest, RouteOptimizationResponse, RouteStopOut
from ..optimizer import solve_collection_route
from ..config import settings
from ..auth import require_admin, get_optional_user

router = APIRouter(prefix="/routes", tags=["Route Optimization"])

@router.post("/optimize", response_model=RouteOptimizationResponse)
def optimize_route(
    req: RouteOptimizationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user)
):
    if not req.complaint_ids:
        raise HTTPException(status_code=400, detail="At least one complaint ID is required for route optimization")

    # Fetch complaints from database
    complaints = db.query(Complaint).filter(Complaint.id.in_(req.complaint_ids)).all()
    if not complaints:
        raise HTTPException(status_code=404, detail="None of the specified complaints were found")

    depot_lat = req.depot_latitude if req.depot_latitude is not None else settings.DEPOT_LATITUDE
    depot_lon = req.depot_longitude if req.depot_longitude is not None else settings.DEPOT_LONGITUDE
    depot = (depot_lat, depot_lon)

    complaint_dicts = [
        {
            "id": c.id,
            "tracking_number": c.tracking_number,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "severity_level": c.severity_level,
            "priority_score": c.priority_score,
            "predicted_category": c.predicted_category,
            "description": c.description
        }
        for c in complaints
    ]

    # Run Google OR-Tools optimization
    solution = solve_collection_route(depot, complaint_dicts)

    # Persist the collection route in database
    route_record = CollectionRoute(
        route_name=req.route_name or "Daily Smart Collection Route",
        status="GENERATED",
        depot_latitude=depot_lat,
        depot_longitude=depot_lon,
        total_baseline_distance_km=solution["baseline_distance_km"],
        total_optimized_distance_km=solution["optimized_distance_km"],
        distance_reduction_percent=solution["distance_reduction_percent"]
    )
    db.add(route_record)
    db.commit()
    db.refresh(route_record)

    # Persist stops
    for stop_data in solution["ordered_stops"]:
        stop_record = RouteStop(
            route_id=route_record.id,
            complaint_id=stop_data["complaint_id"],
            stop_sequence=stop_data["stop_sequence"],
            stop_status="PENDING"
        )
        db.add(stop_record)
        
        # Update complaint status to ASSIGNED
        c_obj = db.query(Complaint).filter(Complaint.id == stop_data["complaint_id"]).first()
        if c_obj and c_obj.status == "PENDING":
            c_obj.status = "ASSIGNED"

    db.commit()

    return {
        "route_id": route_record.id,
        "route_name": route_record.route_name,
        "depot": {
            "name": settings.DEPOT_NAME,
            "latitude": depot_lat,
            "longitude": depot_lon
        },
        "total_baseline_distance_km": solution["baseline_distance_km"],
        "total_optimized_distance_km": solution["optimized_distance_km"],
        "distance_reduction_percent": solution["distance_reduction_percent"],
        "ordered_stops": solution["ordered_stops"],
        "geojson": solution["geojson"]
    }

@router.get("/latest")
def get_latest_route(db: Session = Depends(get_db)):
    route = db.query(CollectionRoute).order_by(CollectionRoute.created_at.desc()).first()
    if not route:
        return None
    return route
