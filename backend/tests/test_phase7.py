import pytest


def test_doctor_cases_access_and_filtering(client):
    # 1. Register Doctor
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Watson",
        "email": "watson@example.com",
        "password": "DoctorPassword123!",
        "role": "doctor"
    })
    doc_token = doc_res.json()["data"]["access_token"]

    # 2. Register Patient 1 & submit high risk symptom
    p1_res = client.post("/auth/register", json={
        "name": "Patient High Risk",
        "email": "p_high@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    p1_token = p1_res.json()["data"]["access_token"]
    p1_id = p1_res.json()["data"]["patient_id"]

    client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {p1_token}"},
        json={
            "symptoms": ["chest_tightness", "shortness_of_breath"],
            "severity_1_to_5": 5,
            "duration_days": 1
        }
    )

    # 3. Register Patient 2 & submit low/moderate risk symptom
    p2_res = client.post("/auth/register", json={
        "name": "Patient Mild",
        "email": "p_mild@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    p2_token = p2_res.json()["data"]["access_token"]
    p2_id = p2_res.json()["data"]["patient_id"]

    analyze_mild = client.post(
        "/symptoms/analyze",
        headers={"Authorization": f"Bearer {p2_token}"},
        json={
            "symptoms": ["sore_throat", "runny_nose"],
            "severity_1_to_5": 1,
            "duration_days": 2
        }
    )
    mild_case_id = analyze_mild.json()["data"]["assessment_id"]

    # 4. Patient tries to access /doctor/cases -> 403
    unauth_cases = client.get(
        "/doctor/cases",
        headers={"Authorization": f"Bearer {p1_token}"}
    )
    assert unauth_cases.status_code == 403

    # 5. Doctor gets all cases
    all_cases_res = client.get(
        "/doctor/cases",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert all_cases_res.status_code == 200
    cases = all_cases_res.json()["data"]
    assert len(cases) >= 2

    # 6. Doctor filters by high priority
    high_cases_res = client.get(
        "/doctor/cases?priority=high",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert high_cases_res.status_code == 200
    high_cases = high_cases_res.json()["data"]
    assert all(c["priority"] == "high" for c in high_cases)

    # 7. Doctor gets full case detail
    detail_res = client.get(
        f"/doctor/cases/{mild_case_id}",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert detail_res.status_code == 200
    detail = detail_res.json()["data"]
    assert detail["case_id"] == mild_case_id
    assert detail["patient"]["name"] == "Patient Mild"
    assert detail["case_status"] == "pending"
    assert "symptoms" in detail
    assert "ai_prediction" in detail

    # 8. Non-existent case -> 404
    not_found = client.get(
        "/doctor/cases/99999",
        headers={"Authorization": f"Bearer {doc_token}"}
    )
    assert not_found.status_code == 404
