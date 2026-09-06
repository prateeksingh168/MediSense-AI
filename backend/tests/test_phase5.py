import pytest


def test_symptom_analyze_and_history_flow(client):
    # 1. Register Patient
    p_res = client.post("/auth/register", json={
        "name": "Kavita Rao",
        "email": "kavita@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token = p_res.json()["data"]["access_token"]
    patient_id = p_res.json()["data"]["patient_id"]

    # 2. Analyze mild symptoms
    analyze_res1 = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "symptoms": ["fever", "cough", "fatigue"],
            "temperature": 38.2,
            "duration_days": 2,
            "severity_1_to_5": 2,
            "additional_information": "Occasional dry cough"
        }
    )
    assert analyze_res1.status_code == 201
    data1 = analyze_res1.json()["data"]
    assert data1["assessment_id"] is not None
    assert data1["risk_level"] in ["low", "moderate"]
    assert len(data1["probable_conditions"]) > 0
    assert "disclaimer" in data1
    assert "diagnosis" not in data1["disclaimer"].lower() or "does not constitute" in data1["disclaimer"].lower()

    # 3. Analyze high-risk symptoms
    analyze_res2 = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "symptoms": ["chest_tightness", "shortness_of_breath"],
            "temperature": 37.0,
            "duration_days": 1,
            "severity_1_to_5": 5,
            "additional_information": "Sudden onset chest tightness"
        }
    )
    assert analyze_res2.status_code == 201
    data2 = analyze_res2.json()["data"]
    assert data2["risk_level"] == "high"

    # 4. Get History
    hist_res = client.get(
        f"/symptoms/history/{patient_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert hist_res.status_code == 200
    history = hist_res.json()["data"]
    assert len(history) == 2
    # Most recent first
    assert "chest_tightness" in history[0]["symptoms"]
    assert history[0]["prediction"]["risk_level"] == "high"
    assert "fever" in history[1]["symptoms"]


def test_symptom_analyze_doctor_on_behalf(client):
    # 1. Register Patient & Doctor
    p_res = client.post("/auth/register", json={
        "name": "Arun Kumar",
        "email": "arun@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    patient_id = p_res.json()["data"]["patient_id"]

    d_res = client.post("/auth/register", json={
        "name": "Dr. Sen",
        "email": "drsen@example.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    doc_token = d_res.json()["data"]["access_token"]

    # 2. Doctor submits symptom analysis on behalf of patient
    analyze_res = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {doc_token}"},
        json={
            "patient_id": patient_id,
            "symptoms": ["vomiting", "diarrhea", "abdominal_pain"],
            "duration_days": 1,
            "severity_1_to_5": 3
        }
    )
    assert analyze_res.status_code == 201
    assert analyze_res.json()["data"]["risk_level"] in ["moderate", "high"]

    # 3. Doctor retrieves history
    hist_res = client.get(
        f"/symptoms/history/{patient_id}",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert hist_res.status_code == 200
    assert len(hist_res.json()["data"]) == 1


def test_symptom_history_unauthorized(client):
    # Register 2 patients
    p1 = client.post("/auth/register", json={
        "name": "P1", "email": "p1_sym@example.com", "password": "Pass123!","role": "patient"
    }).json()["data"]
    p2 = client.post("/auth/register", json={
        "name": "P2", "email": "p2_sym@example.com", "password": "Pass123!","role": "patient"
    }).json()["data"]

    # P1 tries to read P2's history -> 403
    res = client.get(
        f"/symptoms/history/{p2['patient_id']}",
        headers={"Authorization": f"Bearer {p1['access_token']}"}
    )
    assert res.status_code == 403
