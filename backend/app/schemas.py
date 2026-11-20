from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# User & Auth
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "citizen"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    email: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime

# Waste Category
class WasteCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    display_name: str
    default_severity: int

# Complaint
class ComplaintCreateResponse(BaseModel):
    id: str
    tracking_number: str
    description: str
    latitude: float
    longitude: float
    image_url: str
    predicted_category: str
    confidence_score: float
    severity_level: int
    priority_score: float
    status: str
    created_at: datetime

class ComplaintOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    tracking_number: str
    description: str
    latitude: float
    longitude: float
    image_url: str
    predicted_category: str
    confidence_score: float
    is_user_overridden: bool
    severity_level: int
    priority_score: float
    status: str
    reported_by_email: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

class ComplaintOverrideRequest(BaseModel):
    category_code: str
    severity_level: Optional[int] = None

class ComplaintStatusUpdate(BaseModel):
    status: str

# Route Optimization
class RouteOptimizationRequest(BaseModel):
    route_name: Optional[str] = "Daily Smart Collection Route"
    complaint_ids: List[str]
    depot_latitude: Optional[float] = None
    depot_longitude: Optional[float] = None

class RouteStopOut(BaseModel):
    stop_sequence: int
    complaint_id: str
    tracking_number: str
    latitude: float
    longitude: float
    severity_level: int
    priority_score: float
    category: str
    description: str

class RouteOptimizationResponse(BaseModel):
    route_id: str
    route_name: str
    depot: dict
    total_baseline_distance_km: float
    total_optimized_distance_km: float
    distance_reduction_percent: float
    ordered_stops: List[RouteStopOut]
    geojson: dict

# Waste Bins
class WasteBinOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    bin_code: str
    zone: str
    location_name: str
    latitude: float
    longitude: float
    waste_type: str
    capacity_liters: int
    current_fill_percent: float
    status: str
    priority_score: float
    last_collected_at: Optional[datetime] = None
    assigned_route_id: Optional[str] = None
    sensor_id: Optional[str] = None
    sensor_battery_percent: int
    updated_at: datetime

class WasteBinUpdate(BaseModel):
    current_fill_percent: Optional[float] = None
    status: Optional[str] = None
    assigned_route_id: Optional[str] = None

# Vehicles
class VehicleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    vehicle_code: str
    plate_number: str
    model: str
    vehicle_type: str
    capacity_kg: float
    current_load_kg: float
    driver_name: str
    driver_phone: Optional[str] = None
    status: str
    latitude: float
    longitude: float
    assigned_route_id: Optional[str] = None
    fuel_level_percent: int
    total_stops_completed: int
    total_stops_assigned: int

class VehicleUpdate(BaseModel):
    status: Optional[str] = None
    assigned_route_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_load_kg: Optional[float] = None

# Admin Analytics
class DashboardSummary(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    average_resolution_hours: float
    category_distribution: dict
    severity_distribution: dict
    hotspot_count: int
    # Enterprise KPIs
    total_bins: int = 0
    pending_collections: int = 0
    collections_completed: int = 0
    active_vehicles: int = 0
    route_efficiency: float = 0.0
    citizen_complaints_open: int = 0
    citizen_complaints_resolved: int = 0
    zone_stats: Optional[dict] = None

class HotspotInfo(BaseModel):
    center_latitude: float
    center_longitude: float
    complaint_count: int
    complaint_ids: List[str]
    max_priority: float

