import uuid
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_admin_login():
    # Login with default seeded admin credentials
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin@ecoroute.local",
            "password": "AdminSecurePass123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "admin"
    assert data["token_type"] == "bearer"

def test_user_registration():
    unique_email = f"user_{uuid.uuid4().hex[:6]}@ecoroute.local"
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": unique_email,
            "password": "UserPass123!",
            "full_name": "Test Citizen",
            "role": "citizen"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == unique_email
    assert data["role"] == "citizen"
