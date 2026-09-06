import pytest


def test_register_patient_success(client):
    payload = {
        "name": "Riya Sharma",
        "email": "riya@example.com",
        "password": "SecurePass123",
        "role": "patient"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["email"] == "riya@example.com"
    assert data["data"]["role"] == "patient"
    assert data["data"]["patient_id"] is not None
    assert data["data"]["access_token"] != ""


def test_register_doctor_success(client):
    payload = {
        "name": "Dr. Aarav Patel",
        "email": "aarav@example.com",
        "password": "DoctorPass123",
        "role": "doctor",
        "specialization": "Cardiology"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["role"] == "doctor"
    assert data["data"]["doctor_id"] is not None


def test_register_duplicate_email(client):
    payload = {
        "name": "Riya Sharma",
        "email": "riya_dup@example.com",
        "password": "SecurePass123",
        "role": "patient"
    }
    res1 = client.post("/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/auth/register", json=payload)
    assert res2.status_code == 409


def test_login_success_and_me(client):
    # 1. Register user
    reg_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password123!",
        "role": "patient"
    }
    client.post("/auth/register", json=reg_payload)

    # 2. Login
    login_payload = {
        "email": "test@example.com",
        "password": "Password123!"
    }
    login_res = client.post("/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["data"]["access_token"]
    assert token != ""

    # 3. Access protected route with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["data"]["email"] == "test@example.com"


def test_login_invalid_password(client):
    reg_payload = {
        "name": "Test User",
        "email": "test2@example.com",
        "password": "Password123!",
        "role": "patient"
    }
    client.post("/auth/register", json=reg_payload)

    login_res = client.post("/auth/login", json={
        "email": "test2@example.com",
        "password": "WrongPassword"
    })
    assert login_res.status_code == 401


def test_protected_route_without_token(client):
    res = client.get("/auth/me")
    assert res.status_code in [401, 403]
