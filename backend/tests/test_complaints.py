import io
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_list_waste_categories():
    response = client.get("/api/v1/complaints/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 4
    codes = [c["code"] for c in categories]
    assert "overflowing_bin" in codes
    assert "mixed_waste" in codes

def test_submit_and_track_complaint():
    # Generate test image
    img = Image.new("RGB", (100, 100), color=(120, 150, 80))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)

    # Submit complaint via multipart form
    response = client.post(
        "/api/v1/complaints",
        data={
            "description": "Severe garbage dump overflowing onto main road",
            "latitude": 12.9750,
            "longitude": 77.5950,
            "reported_by_email": "testcitizen@example.com"
        },
        files={
            "photo": ("waste_test.jpg", buffer, "image/jpeg")
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "tracking_number" in data
    assert data["tracking_number"].startswith("CMP-")
    assert data["status"] == "PENDING"
    assert data["priority_score"] > 0

    # Track by tracking number
    track_res = client.get(f"/api/v1/complaints/track/{data['tracking_number']}")
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert track_data["id"] == data["id"]
    assert track_data["description"] == data["description"]
