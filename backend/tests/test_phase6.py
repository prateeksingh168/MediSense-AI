import pytest


def test_health_records_flow(client):
    # 1. Register Patient
    p_res = client.post("/auth/register", json={
        "name": "Manish Verma",
        "email": "manish@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token = p_res.json()["data"]["access_token"]
    patient_id = p_res.json()["data"]["patient_id"]

    # 2. Add Health Record 1
    rec1 = client.post(
        "/health-records",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "height_cm": 175.0,
            "weight_kg": 70.0,
            "heart_rate_bpm": 74,
            "systolic_bp": 120,
            "diastolic_bp": 80,
            "temperature": 36.8,
            "spo2_percent": 98.5,
            "symptoms": ["fatigue"],
            "notes": "Baseline measurement"
        }
    )
    assert rec1.status_code == 201
    data1 = rec1.json()["data"]
    assert data1["bmi"] == 22.9
    assert data1["patient_id"] == patient_id

    # 3. Add Health Record 2 (Follow up)
    rec2 = client.post(
        "/health-records",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "height_cm": 175.0,
            "weight_kg": 69.5,
            "heart_rate_bpm": 70,
            "systolic_bp": 118,
            "diastolic_bp": 78,
            "temperature": 36.6,
            "spo2_percent": 99.0,
            "notes": "Followup visit"
        }
    )
    assert rec2.status_code == 201

    # 4. Get History
    get_res = client.get(
        f"/health-records/{patient_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_res.status_code == 200
    records = get_res.json()["data"]
    assert len(records) == 2
    assert "date" in records[0]
    assert records[0]["systolic_bp"] == 120
    assert records[1]["systolic_bp"] == 118


def test_health_records_invalid_validation(client):
    p_res = client.post("/auth/register", json={
        "name": "Invalid Tester",
        "email": "invalid_test@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token = p_res.json()["data"]["access_token"]

    # SpO2 > 100 should fail
    bad_spo2 = client.post(
        "/health-records",
        headers={"Authorization": f"Bearer {token}"},
        json={"spo2_percent": 105.0}
    )
    assert bad_spo2.status_code == 422

    # Negative heart rate should fail
    bad_hr = client.post(
        "/health-records",
        headers={"Authorization": f"Bearer {token}"},
        json={"heart_rate_bpm": -20}
    )
    assert bad_hr.status_code == 422


def test_health_records_doctor_access(client):
    # Patient & Doctor
    p_res = client.post("/auth/register", json={
        "name": "P_Vitals", "email": "p_vitals@example.com", "password": "Password123!","role": "patient"
    }).json()["data"]

    d_res = client.post("/auth/register", json={
        "name": "Dr. Vitals", "email": "d_vitals@example.com", "password": "DoctorPassword123!","role": "doctor"
    }).json()["data"]

    # Doctor records vitals for patient
    doc_create = client.post(
        "/health-records",
        headers={"Authorization": f"Bearer {d_res['access_token']}"},
        json={
            "patient_id": p_res["patient_id"],
            "heart_rate_bpm": 80,
            "systolic_bp": 130,
            "diastolic_bp": 85,
            "temperature": 37.1,
            "spo2_percent": 97.0
        }
    )
    assert doc_create.status_code == 201

    # Doctor reads patient vitals
    doc_get = client.get(
        f"/health-records/{p_res['patient_id']}",
        headers={"Authorization": f"Bearer {d_res['access_token']}"}
    )
    assert doc_get.status_code == 200
    assert len(doc_get.json()["data"]) == 1
