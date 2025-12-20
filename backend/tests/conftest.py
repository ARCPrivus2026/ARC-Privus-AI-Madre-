"""
Test configuration and fixtures
"""
import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def auth_token(client):
    """Get an authentication token for testing"""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None
