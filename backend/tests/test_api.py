"""
Tests for API endpoints
"""
import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data


def test_health_status_endpoint(client):
    """Test detailed health status endpoint"""
    response = client.get("/api/v1/health/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "uptime_seconds" in data
    assert "system" in data


def test_health_ping_endpoint(client):
    """Test ping endpoint"""
    response = client.get("/api/v1/health/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "pong"


def test_register_endpoint(client):
    """Test user registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "secure",
            "full_name": "New User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "message" in data
    assert "email" in data


def test_login_endpoint(client):
    """Test user login"""
    # First register a user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "testlogin@example.com",
            "password": "testpass",
            "full_name": "Test User"
        }
    )
    
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testlogin@example.com",
            "password": "testpass"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


def test_ai_capabilities_endpoint(client):
    """Test AI capabilities endpoint (public)"""
    response = client.get("/api/v1/ai/capabilities")
    assert response.status_code == 200
    data = response.json()
    assert "capabilities" in data
    assert "modules" in data


def test_ai_models_endpoint_requires_auth(client):
    """Test that AI models endpoint requires authentication"""
    response = client.get("/api/v1/ai/models")
    # 403 is expected as FastAPI returns 403 for missing auth credentials
    assert response.status_code in [401, 403]


def test_ai_inference_requires_auth(client):
    """Test that AI inference requires authentication"""
    response = client.post(
        "/api/v1/ai/infer",
        json={
            "prompt": "Test prompt"
        }
    )
    # 403 is expected as FastAPI returns 403 for missing auth credentials
    assert response.status_code in [401, 403]


def test_invalid_endpoint(client):
    """Test 404 for invalid endpoint"""
    response = client.get("/api/v1/invalid/endpoint")
    assert response.status_code == 404
