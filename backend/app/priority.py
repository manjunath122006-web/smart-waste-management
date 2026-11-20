from datetime import datetime
from typing import List
from .optimizer import haversine_distance_km

def calculate_priority_score(
    severity_level: int,
    created_at: datetime,
    latitude: float,
    longitude: float,
    all_active_complaints: List[dict],
    w1: float = 0.50,
    w2: float = 0.30,
    w3: float = 0.20
) -> float:
    """
    Computes deterministic priority score (0 to 100) based on:
    - Severity (1 to 5)
    - Elapsed waiting time (hours up to 72h max)
    - Hotspot density (count of other active complaints within 200m)
    """
    # 1. Severity Factor (0.0 to 1.0)
    s_norm = max(1, min(5, severity_level)) / 5.0

    # 2. Waiting Time Factor (0.0 to 1.0)
    if created_at:
        from datetime import timezone
        if created_at.tzinfo is not None:
            c_naive = created_at.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            c_naive = created_at
        now = datetime.utcnow()
        hours_elapsed = max(0.0, (now - c_naive).total_seconds() / 3600.0)
    else:
        hours_elapsed = 0.0
    t_norm = min(1.0, hours_elapsed / 72.0)

    # 3. Hotspot Density Factor (0.0 to 1.0)
    # Count nearby complaints within 200 meters (0.2 km)
    nearby_count = 0
    for other in all_active_complaints:
        o_lat = other.get("latitude")
        o_lon = other.get("longitude")
        if o_lat is not None and o_lon is not None:
            dist = haversine_distance_km(latitude, longitude, o_lat, o_lon)
            if 0.0001 < dist <= 0.2:  # within 200m, excluding exact self
                nearby_count += 1
                
    h_norm = min(1.0, nearby_count / 5.0)

    # Composite normalized score
    composite = (w1 * s_norm) + (w2 * t_norm) + (w3 * h_norm)
    return round(composite * 100.0, 2)
