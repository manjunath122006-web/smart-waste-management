from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_bins_endpoints():
    response = client.get("/api/v1/bins")
    assert response.status_code == 200
    bins = response.json()
    assert isinstance(bins, list)
    assert len(bins) > 0
    bin_id = bins[0]["id"]
    
    # Test get bin by ID
    get_res = client.get(f"/api/v1/bins/{bin_id}")
    assert get_res.status_code == 200
    assert get_res.json()["bin_code"] == bins[0]["bin_code"]

    # Test patch bin
    patch_res = client.patch(f"/api/v1/bins/{bin_id}", json={"current_fill_percent": 95.0})
    assert patch_res.status_code == 200
    assert patch_res.json()["current_fill_percent"] == 95.0
    assert patch_res.json()["status"] == "CRITICAL"

def test_vehicles_endpoints():
    response = client.get("/api/v1/vehicles")
    assert response.status_code == 200
    vehicles = response.json()
    assert isinstance(vehicles, list)
    assert len(vehicles) > 0
    vehicle_id = vehicles[0]["id"]

    # Test get vehicle by ID
    get_res = client.get(f"/api/v1/vehicles/{vehicle_id}")
    assert get_res.status_code == 200
    assert get_res.json()["vehicle_code"] == vehicles[0]["vehicle_code"]

def test_admin_summary_kpis():
    response = client.get("/api/v1/admin/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_bins" in data
    assert "pending_collections" in data
    assert "collections_completed" in data
    assert "active_vehicles" in data
    assert "route_efficiency" in data
    assert "citizen_complaints_open" in data
    assert "citizen_complaints_resolved" in data
