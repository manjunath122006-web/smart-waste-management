from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Vehicle, CollectionRoute, RouteStop, User
from ..schemas import VehicleOut, VehicleUpdate
from ..auth import get_optional_user

router = APIRouter(prefix="/vehicles", tags=["Fleet Vehicles"])

@router.get("", response_model=List[VehicleOut])
def list_vehicles(
    status: Optional[str] = Query(None, description="Filter by vehicle status: ACTIVE, EN_ROUTE, COLLECTING, STANDBY"),
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    return query.order_by(Vehicle.vehicle_code.asc()).all()

@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    veh = db.query(Vehicle).filter((Vehicle.id == vehicle_id) | (Vehicle.vehicle_code == vehicle_id)).first()
    if not veh:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return veh

@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: str, payload: VehicleUpdate, db: Session = Depends(get_db)):
    veh = db.query(Vehicle).filter((Vehicle.id == vehicle_id) | (Vehicle.vehicle_code == vehicle_id)).first()
    if not veh:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if payload.status is not None:
        veh.status = payload.status
    if payload.assigned_route_id is not None:
        veh.assigned_route_id = payload.assigned_route_id
    if payload.latitude is not None:
        veh.latitude = payload.latitude
    if payload.longitude is not None:
        veh.longitude = payload.longitude
    if payload.current_load_kg is not None:
        veh.current_load_kg = payload.current_load_kg

    db.commit()
    db.refresh(veh)
    return veh

@router.post("/{vehicle_id}/assign-route/{route_id}", response_model=VehicleOut)
def assign_vehicle_route(vehicle_id: str, route_id: str, db: Session = Depends(get_db)):
    veh = db.query(Vehicle).filter((Vehicle.id == vehicle_id) | (Vehicle.vehicle_code == vehicle_id)).first()
    if not veh:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    route = db.query(CollectionRoute).filter(CollectionRoute.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Collection route not found")

    veh.assigned_route_id = route.id
    veh.status = "EN_ROUTE"
    # Count stops
    stop_count = db.query(RouteStop).filter(RouteStop.route_id == route.id).count()
    veh.total_stops_assigned = stop_count
    veh.total_stops_completed = 0

    db.commit()
    db.refresh(veh)
    return veh
