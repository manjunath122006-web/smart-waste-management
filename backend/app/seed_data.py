from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from .models import User, WasteCategory, Complaint, WasteBin, Vehicle
from .auth import hash_password
from .config import settings
from .priority import calculate_priority_score

SAMPLE_BINS = [
    {"bin_code": "BIN-101", "zone": "Central Commercial", "location_name": "MG Road Metro Concourse", "latitude": 12.9754, "longitude": 77.6062, "waste_type": "general", "capacity_liters": 1100, "current_fill_percent": 94.0, "status": "CRITICAL", "priority_score": 88.5, "sensor_id": "IOT-SENS-101", "sensor_battery_percent": 91},
    {"bin_code": "BIN-102", "zone": "Central Commercial", "location_name": "Brigade Road Crossing", "latitude": 12.9738, "longitude": 77.6078, "waste_type": "recyclable", "capacity_liters": 1100, "current_fill_percent": 82.0, "status": "WARNING", "priority_score": 62.0, "sensor_id": "IOT-SENS-102", "sensor_battery_percent": 88},
    {"bin_code": "BIN-103", "zone": "Central Commercial", "location_name": "Cubbon Park North Gate", "latitude": 12.9778, "longitude": 77.5925, "waste_type": "organic", "capacity_liters": 800, "current_fill_percent": 35.0, "status": "NORMAL", "priority_score": 18.0, "sensor_id": "IOT-SENS-103", "sensor_battery_percent": 96},
    {"bin_code": "BIN-201", "zone": "East Market", "location_name": "Russell Market Wholesale Bay", "latitude": 12.9835, "longitude": 77.6042, "waste_type": "organic", "capacity_liters": 2400, "current_fill_percent": 98.0, "status": "CRITICAL", "priority_score": 95.0, "sensor_id": "IOT-SENS-201", "sensor_battery_percent": 79},
    {"bin_code": "BIN-202", "zone": "East Market", "location_name": "Commercial Street South Alley", "latitude": 12.9818, "longitude": 77.6085, "waste_type": "recyclable", "capacity_liters": 1100, "current_fill_percent": 78.5, "status": "WARNING", "priority_score": 58.0, "sensor_id": "IOT-SENS-202", "sensor_battery_percent": 84},
    {"bin_code": "BIN-203", "zone": "East Market", "location_name": "Shivajinagar Bus Terminus", "latitude": 12.9862, "longitude": 77.6018, "waste_type": "general", "capacity_liters": 1800, "current_fill_percent": 42.0, "status": "NORMAL", "priority_score": 24.0, "sensor_id": "IOT-SENS-203", "sensor_battery_percent": 92},
    {"bin_code": "BIN-301", "zone": "West Residential", "location_name": "Malleshwaram 8th Cross Park", "latitude": 12.9965, "longitude": 77.5710, "waste_type": "organic", "capacity_liters": 800, "current_fill_percent": 89.0, "status": "WARNING", "priority_score": 71.0, "sensor_id": "IOT-SENS-301", "sensor_battery_percent": 86},
    {"bin_code": "BIN-302", "zone": "West Residential", "location_name": "Sampige Road Market Entrance", "latitude": 12.9930, "longitude": 77.5702, "waste_type": "general", "capacity_liters": 1100, "current_fill_percent": 91.5, "status": "CRITICAL", "priority_score": 86.0, "sensor_id": "IOT-SENS-302", "sensor_battery_percent": 94},
    {"bin_code": "BIN-303", "zone": "West Residential", "location_name": "Sankey Tank Promenade", "latitude": 13.0012, "longitude": 77.5760, "waste_type": "recyclable", "capacity_liters": 600, "current_fill_percent": 28.0, "status": "NORMAL", "priority_score": 14.0, "sensor_id": "IOT-SENS-303", "sensor_battery_percent": 98},
    {"bin_code": "BIN-401", "zone": "South Suburbs", "location_name": "Koramangala 5th Block Hub", "latitude": 12.9345, "longitude": 77.6180, "waste_type": "general", "capacity_liters": 1500, "current_fill_percent": 96.0, "status": "CRITICAL", "priority_score": 92.0, "sensor_id": "IOT-SENS-401", "sensor_battery_percent": 89},
    {"bin_code": "BIN-402", "zone": "South Suburbs", "location_name": "Sony World Junction Corner", "latitude": 12.9382, "longitude": 77.6254, "waste_type": "recyclable", "capacity_liters": 1100, "current_fill_percent": 55.0, "status": "NORMAL", "priority_score": 30.0, "sensor_id": "IOT-SENS-402", "sensor_battery_percent": 93},
    {"bin_code": "BIN-403", "zone": "South Suburbs", "location_name": "Indiranagar 100ft Road Circle", "latitude": 12.9698, "longitude": 77.6412, "waste_type": "general", "capacity_liters": 1100, "current_fill_percent": 84.0, "status": "WARNING", "priority_score": 64.0, "sensor_id": "IOT-SENS-403", "sensor_battery_percent": 87}
]

SAMPLE_VEHICLES = [
    {
        "vehicle_code": "TRK-01",
        "plate_number": "KA-01-EA-4412",
        "model": "Volvo FL Electric Compactor 10T",
        "vehicle_type": "Compactor Truck",
        "capacity_kg": 8500.0,
        "current_load_kg": 6240.0,
        "driver_name": "Rajesh Kumar",
        "driver_phone": "+91 98450 12891",
        "status": "EN_ROUTE",
        "latitude": 12.9740,
        "longitude": 77.6020,
        "fuel_level_percent": 78,
        "total_stops_completed": 4,
        "total_stops_assigned": 7
    },
    {
        "vehicle_code": "TRK-02",
        "plate_number": "KA-01-GA-8190",
        "model": "Mercedes-Benz Econic Heavy 12T",
        "vehicle_type": "Heavy Compactor",
        "capacity_kg": 12000.0,
        "current_load_kg": 9850.0,
        "driver_name": "Suresh Gowda",
        "driver_phone": "+91 98862 39102",
        "status": "COLLECTING",
        "latitude": 12.9820,
        "longitude": 77.6050,
        "fuel_level_percent": 65,
        "total_stops_completed": 6,
        "total_stops_assigned": 8
    },
    {
        "vehicle_code": "TRK-03",
        "plate_number": "KA-04-MB-2219",
        "model": "Isuzu N-Series Mini Compactor 5T",
        "vehicle_type": "Mini Compactor",
        "capacity_kg": 4500.0,
        "current_load_kg": 1950.0,
        "driver_name": "Anil Nayak",
        "driver_phone": "+91 97411 88301",
        "status": "ACTIVE",
        "latitude": 12.9940,
        "longitude": 77.5720,
        "fuel_level_percent": 90,
        "total_stops_completed": 2,
        "total_stops_assigned": 5
    },
    {
        "vehicle_code": "TRK-04",
        "plate_number": "KA-05-EV-1004",
        "model": "Tata Ace EV Rapid Collector",
        "vehicle_type": "Electric Rapid Van",
        "capacity_kg": 1800.0,
        "current_load_kg": 420.0,
        "driver_name": "Mohan Rao",
        "driver_phone": "+91 99014 44520",
        "status": "STANDBY",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "fuel_level_percent": 100,
        "total_stops_completed": 0,
        "total_stops_assigned": 0
    }
]

SAMPLE_COMPLAINTS = [
    {
        "tracking_number": "CMP-20261026-A101",
        "description": "Massive overflow of municipal bin near Metro Station entrance. Obstructing pedestrian sidewalk.",
        "latitude": 12.9752,
        "longitude": 77.5991,
        "category": "overflowing_bin",
        "severity": 5,
        "hours_ago": 18,
        "status": "PENDING"
    },
    {
        "tracking_number": "CMP-20261026-B202",
        "description": "Illegal dumping of construction mixed debris and organic trash behind vegetable market.",
        "latitude": 12.9815,
        "longitude": 77.6045,
        "category": "mixed_waste",
        "severity": 4,
        "hours_ago": 36,
        "status": "PENDING"
    },
    {
        "tracking_number": "CMP-20261026-C303",
        "description": "Commercial plastic packaging and cardboard cartons piled up outside shopping complex.",
        "latitude": 12.9680,
        "longitude": 77.5910,
        "category": "recyclable_waste",
        "severity": 2,
        "hours_ago": 8,
        "status": "PENDING"
    },
    {
        "tracking_number": "CMP-20261026-D404",
        "description": "Overflowing public park bin with food wrappers and beverage containers.",
        "latitude": 12.9730,
        "longitude": 77.6015,
        "category": "overflowing_bin",
        "severity": 5,
        "hours_ago": 4,
        "status": "PENDING"
    },
    {
        "tracking_number": "CMP-20261026-E505",
        "description": "Accumulation of dry tree branches and mixed road sweepings near bus terminal.",
        "latitude": 12.9645,
        "longitude": 77.5855,
        "category": "mixed_waste",
        "severity": 3,
        "hours_ago": 48,
        "status": "ASSIGNED"
    },
    {
        "tracking_number": "CMP-20261026-F606",
        "description": "Residential colony primary bin emptied successfully yesterday afternoon.",
        "latitude": 12.9790,
        "longitude": 77.5870,
        "category": "overflowing_bin",
        "severity": 4,
        "hours_ago": 60,
        "status": "RESOLVED"
    }
]

def seed_database(db: Session):
    # 1. Seed Categories
    categories = [
        {"code": "overflowing_bin", "display_name": "Overflowing Garbage Bin", "default_severity": 5},
        {"code": "mixed_waste", "display_name": "Mixed Unsorted Waste Pile", "default_severity": 4},
        {"code": "recyclable_waste", "display_name": "Accumulated Recyclable Waste", "default_severity": 2},
        {"code": "other", "display_name": "General / Other Urban Waste", "default_severity": 1},
    ]

    for cat_data in categories:
        existing = db.query(WasteCategory).filter(WasteCategory.code == cat_data["code"]).first()
        if not existing:
            cat = WasteCategory(**cat_data)
            db.add(cat)
    db.commit()

    # 2. Seed Default Admin
    admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL.lower()).first()
    if not admin_user:
        admin = User(
            email=settings.ADMIN_EMAIL.lower(),
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            full_name="Municipal Operations Director",
            role="admin"
        )
        db.add(admin)
        db.commit()

    # 3. Seed Waste Bins
    if db.query(WasteBin).count() == 0:
        for b_data in SAMPLE_BINS:
            last_col = datetime.now(timezone.utc) - timedelta(hours=b_data["current_fill_percent"] * 0.4)
            bin_obj = WasteBin(
                bin_code=b_data["bin_code"],
                zone=b_data["zone"],
                location_name=b_data["location_name"],
                latitude=b_data["latitude"],
                longitude=b_data["longitude"],
                waste_type=b_data["waste_type"],
                capacity_liters=b_data["capacity_liters"],
                current_fill_percent=b_data["current_fill_percent"],
                status=b_data["status"],
                priority_score=b_data["priority_score"],
                sensor_id=b_data["sensor_id"],
                sensor_battery_percent=b_data["sensor_battery_percent"],
                last_collected_at=last_col
            )
            db.add(bin_obj)
        db.commit()

    # 4. Seed Vehicles
    if db.query(Vehicle).count() == 0:
        for v_data in SAMPLE_VEHICLES:
            veh = Vehicle(**v_data)
            db.add(veh)
        db.commit()

    # 5. Seed Sample Complaints if database is empty
    count = db.query(Complaint).count()
    if count == 0:
        active_dicts = [{"latitude": c["latitude"], "longitude": c["longitude"]} for c in SAMPLE_COMPLAINTS]
        
        for sample in SAMPLE_COMPLAINTS:
            created_at = datetime.now(timezone.utc) - timedelta(hours=sample["hours_ago"])
            cat_row = db.query(WasteCategory).filter(WasteCategory.code == sample["category"]).first()

            priority = calculate_priority_score(
                severity_level=sample["severity"],
                created_at=created_at,
                latitude=sample["latitude"],
                longitude=sample["longitude"],
                all_active_complaints=active_dicts
            )

            resolved_at = datetime.now(timezone.utc) - timedelta(hours=12) if sample["status"] == "RESOLVED" else None

            c = Complaint(
                tracking_number=sample["tracking_number"],
                description=sample["description"],
                latitude=sample["latitude"],
                longitude=sample["longitude"],
                image_storage_key="sample_waste_placeholder.jpg",
                image_url="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
                category_id=cat_row.id if cat_row else None,
                predicted_category=sample["category"],
                confidence_score=0.91,
                is_user_overridden=False,
                severity_level=sample["severity"],
                priority_score=priority,
                status=sample["status"],
                reported_by_email="citizen@ecoroute.local",
                created_at=created_at,
                resolved_at=resolved_at
            )
            db.add(c)
        db.commit()

