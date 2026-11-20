import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="citizen", nullable=False)  # "citizen" or "admin"
    created_at = Column(DateTime, default=utc_now)

class WasteCategory(Base):
    __tablename__ = "waste_categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    default_severity = Column(Integer, nullable=False, default=3)  # 1 to 5

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tracking_number = Column(String(32), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_storage_key = Column(String(512), nullable=False)
    image_url = Column(Text, nullable=False)
    
    category_id = Column(Integer, ForeignKey("waste_categories.id"), nullable=True)
    predicted_category = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    is_user_overridden = Column(Boolean, default=False)
    severity_level = Column(Integer, nullable=False, default=3)
    priority_score = Column(Float, nullable=False, default=0.0)
    
    status = Column(String(30), default="PENDING", index=True)  # PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
    reported_by_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now, index=True)
    resolved_at = Column(DateTime, nullable=True)

    category = relationship("WasteCategory")
    route_stops = relationship("RouteStop", back_populates="complaint")

class WasteBin(Base):
    __tablename__ = "waste_bins"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    bin_code = Column(String(50), unique=True, index=True, nullable=False)
    zone = Column(String(100), nullable=False)
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    waste_type = Column(String(50), nullable=False, default="general")
    capacity_liters = Column(Integer, default=1100)
    current_fill_percent = Column(Float, default=0.0)
    status = Column(String(30), default="NORMAL")  # NORMAL, WARNING, CRITICAL, COLLECTING
    priority_score = Column(Float, default=0.0)
    last_collected_at = Column(DateTime, nullable=True)
    assigned_route_id = Column(String(36), ForeignKey("collection_routes.id"), nullable=True)
    sensor_id = Column(String(50), nullable=True)
    sensor_battery_percent = Column(Integer, default=95)
    updated_at = Column(DateTime, default=utc_now)

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_code = Column(String(50), unique=True, index=True, nullable=False)
    plate_number = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    vehicle_type = Column(String(50), nullable=False)  # Compactor, Side-Loader, Electric Mini
    capacity_kg = Column(Float, default=5000.0)
    current_load_kg = Column(Float, default=0.0)
    driver_name = Column(String(100), nullable=False)
    driver_phone = Column(String(50), nullable=True)
    status = Column(String(30), default="ACTIVE")  # ACTIVE, EN_ROUTE, COLLECTING, STANDBY, MAINTENANCE
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    assigned_route_id = Column(String(36), ForeignKey("collection_routes.id"), nullable=True)
    fuel_level_percent = Column(Integer, default=85)
    total_stops_completed = Column(Integer, default=0)
    total_stops_assigned = Column(Integer, default=0)

class CollectionRoute(Base):
    __tablename__ = "collection_routes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    route_name = Column(String(100), nullable=False)
    status = Column(String(30), default="GENERATED")  # GENERATED, IN_PROGRESS, COMPLETED
    depot_latitude = Column(Float, nullable=False)
    depot_longitude = Column(Float, nullable=False)
    total_baseline_distance_km = Column(Float, nullable=False)
    total_optimized_distance_km = Column(Float, nullable=False)
    distance_reduction_percent = Column(Float, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    stops = relationship("RouteStop", back_populates="route", cascade="all, delete-orphan")

class RouteStop(Base):
    __tablename__ = "route_stops"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    route_id = Column(String(36), ForeignKey("collection_routes.id"), nullable=False)
    complaint_id = Column(String(36), ForeignKey("complaints.id"), nullable=False)
    stop_sequence = Column(Integer, nullable=False)
    stop_status = Column(String(30), default="PENDING")  # PENDING, VISITED, SKIPPED
    completed_at = Column(DateTime, nullable=True)

    route = relationship("CollectionRoute", back_populates="stops")
    complaint = relationship("Complaint", back_populates="route_stops")


