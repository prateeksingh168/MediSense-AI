import pytest


def test_doctor_decision_flow(client):
    # 1. Register Doctor
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Gregory House",
        "email": "drhouse@example.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    doc_token = doc_res.json()["data"]["access_token"]

    # 2. Register Patient and submit symptom assessment
    p_res = client.post("/auth/register", json={
        "name": "Amber Volakis",
        "email": "amber@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    p_token = p_res.json()["data"]["access_token"]

    analyze_res = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {p_token}"},
        json={
            "symptoms": ["headache", "light_sensitivity"],
            "severity_1_to_5": 3,
            "duration_days": 2
        }
    )
    case_id = analyze_res.json()["data"]["assessment_id"]

    # 3. Patient tries to post doctor decision -> 403
    unauth_res = client.post(
        "/doctor/decision",
        headers={"Authorization": f"Bearer {p_token}"},
        json={"assessment_id": case_id, "decision": "accepted"}
    )
    assert unauth_res.status_code == 403

    # 4. Doctor accepts decision
    accept_res = client.post(
        "/doctor/decision",
        headers={"Authorization": f"Bearer {doc_token}"},
        json={"assessment_id": case_id, "decision": "accepted"}
    )
    assert accept_res.status_code == 200
    dec_data = accept_res.json()["data"]
    assert dec_data["decision"] == "accepted"
    assert dec_data["doctor_name"] == "Dr. Gregory House"

    # 5. Check case detail reflects accepted status
    detail_res = client.get(
        f"/doctor/cases/{case_id}",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert detail_res.status_code == 200
    assert detail_res.json()["data"]["case_status"] == "accepted"
    assert detail_res.json()["data"]["doctor_decision"]["decision"] == "accepted"

    # 6. Doctor updates/overrides decision with reason
    override_res = client.post(
        "/doctor/decision",
        headers={"Authorization": f"Bearer {doc_token}"},
        json={
            "assessment_id": case_id,
            "decision": "overridden",
            "reason": "Differential points towards classic migraine rather than tension headache."
        }
    )
    assert override_res.status_code == 200
    assert override_res.json()["data"]["decision"] == "overridden"

    # 7. Check case detail reflects overridden status and reason
    detail_res2 = client.get(
        f"/doctor/cases/{case_id}",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert detail_res2.json()["data"]["case_status"] == "overridden"
    assert "migraine" in detail_res2.json()["data"]["doctor_decision"]["reason"].lower()


def test_doctor_decision_missing_reason_on_override(client):
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Wilson",
        "email": "wilson@example.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    doc_token = doc_res.json()["data"]["access_token"]

    p_res = client.post("/auth/register", json={
        "name": "Patient X",
        "email": "patient_x@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    p_token = p_res.json()["data"]["access_token"]

    analyze_res = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {p_token}"},
        json={"symptoms": ["cough"]}
    )
    case_id = analyze_res.json()["data"]["assessment_id"]

    # Override without reason -> 400
    bad_override = client.post(
        "/doctor/decision",
        headers={"Authorization": f"Bearer {doc_token}"},
        json={"assessment_id": case_id, "decision": "overridden"}
    )
    assert bad_override.status_code == 400


def test_doctor_decision_nonexistent_case(client):
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Cuddy",
        "email": "cuddy@example.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    doc_token = doc_res.json()["data"]["access_token"]

    not_found = client.post(
        "/doctor/decision",
        headers={"Authorization": f"Bearer {doc_token}"},
        json={"assessment_id": 99999, "decision": "accepted"}
    )
    assert not_found.status_code == 404
