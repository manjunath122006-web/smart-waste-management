from backend.app.optimizer import haversine_distance_km, solve_collection_route

def test_haversine_distance():
    # Distance between Bangalore coordinates
    dist = haversine_distance_km(12.9716, 77.5946, 12.9752, 77.5991)
    assert 0.4 < dist < 1.0  # Approx 0.6 km

def test_route_optimization_with_sample_locations():
    depot = (12.9716, 77.5946)
    complaints = [
        {"id": "c1", "tracking_number": "CMP-1", "latitude": 12.9752, "longitude": 77.5991, "severity_level": 5, "priority_score": 85.0},
        {"id": "c2", "tracking_number": "CMP-2", "latitude": 12.9815, "longitude": 77.6045, "severity_level": 4, "priority_score": 70.0},
        {"id": "c3", "tracking_number": "CMP-3", "latitude": 12.9680, "longitude": 77.5910, "severity_level": 2, "priority_score": 45.0},
        {"id": "c4", "tracking_number": "CMP-4", "latitude": 12.9730, "longitude": 77.6015, "severity_level": 5, "priority_score": 90.0},
    ]

    result = solve_collection_route(depot, complaints)
    assert "baseline_distance_km" in result
    assert "optimized_distance_km" in result
    assert "distance_reduction_percent" in result
    assert len(result["ordered_stops"]) == 4
    assert result["optimized_distance_km"] <= result["baseline_distance_km"]
    assert result["distance_reduction_percent"] >= 0.0
