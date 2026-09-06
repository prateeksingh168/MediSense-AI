import pytest


def test_standard_response_envelope_success(client):
    # 1. Root
    root_res = client.get("/")
    assert root_res.status_code == 200
    data = root_res.json()
    assert "success" in data and data["success"] is True
    assert "data" in data and data["data"] is not None
    assert "message" in data
    assert "error" in data and data["error"] is None


def test_standard_response_envelope_404(client):
    res = client.get("/non-existent-endpoint-test-12345")
    assert res.status_code == 404
    data = res.json()
    assert data["success"] is False
    assert data["data"] is None
    assert "error" in data and data["error"] is not None
    assert data["error"]["code"] == "NOT_FOUND"


def test_standard_response_envelope_422(client):
    res = client.post("/auth/register", json={
        "name": "A",  # too short (min_length=2)
        "email": "invalid-email",
        "password": "123"
    })
    assert res.status_code == 422
    data = res.json()
    assert data["success"] is False
    assert data["data"] is None
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "detail" in data["error"]


def test_standard_response_envelope_401(client):
    res = client.get("/patients/1")  # no token
    assert res.status_code == 401
    data = res.json()
    assert data["success"] is False
    assert data["data"] is None
    assert data["error"]["code"] == "UNAUTHORIZED"


def test_standard_response_envelope_403(client):
    # Register patient
    p_res = client.post("/auth/register", json={
        "name": "Patient Envelope Test",
        "email": "p_env@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token = p_res.json()["data"]["access_token"]

    # Try doctor-only route
    doc_res = client.get("/doctor/cases", headers={"Authorization": f"Bearer {token}"})
    assert doc_res.status_code == 403
    data = doc_res.json()
    assert data["success"] is False
    assert data["data"] is None
    assert data["error"]["code"] == "FORBIDDEN"


def test_openapi_schema_completeness(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    schema = res.json()
    assert "openapi" in schema
    assert "paths" in schema

    paths = schema["paths"]
    # Check all key PRD endpoints are registered
    assert "/auth/register" in paths
    assert "/auth/login" in paths
    assert "/patients/{patient_id}" in paths
    assert "/symptoms/analyze" in paths
    assert "/symptoms/history/{patient_id}" in paths
    assert "/health-records" in paths
    assert "/health-records/{patient_id}" in paths
    assert "/doctor/cases" in paths
    assert "/doctor/cases/{case_id}" in paths
    assert "/doctor/decision" in paths

    # Check that HTTP Bearer security scheme is defined
    assert "components" in schema
    assert "securitySchemes" in schema["components"]
