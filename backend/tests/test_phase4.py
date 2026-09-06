import pytest


def test_patient_profile_flow(client):
    # 1. Register Patient 1
    res1 = client.post("/auth/register", json={
        "name": "Patient One",
        "email": "p1@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token1 = res1.json()["data"]["access_token"]
    p1_id = res1.json()["data"]["patient_id"]

    # 2. Register Patient 2
    res2 = client.post("/auth/register", json={
        "name": "Patient Two",
        "email": "p2@example.com",
        "password": "Password123!",
        "role": "patient"
    })
    token2 = res2.json()["data"]["access_token"]
    p2_id = res2.json()["data"]["patient_id"]

    # 3. Register Doctor
    res_doc = client.post("/auth/register", json={
        "name": "Dr. House",
        "email": "doc@example.com",
        "password": "DoctorPassword123!",
        "role": "doctor"
    })
    token_doc = res_doc.json()["data"]["access_token"]

    # 4. Patient 1 updates their own profile
    update_res = client.put(
        f"/patients/{p1_id}",
        headers={"Authorization": f"Bearer {token1}"},
        json={
            "age": 30,
            "gender": "Female",
            "city": "Bengaluru",
            "medical_history": "Hypertension diagnosed 2022",
            "allergies": "Dust, Penicillin",
            "medications": "Amlodipine 5mg"
        }
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()["data"]
    assert updated_data["age"] == 30
    assert updated_data["city"] == "Bengaluru"
    assert updated_data["allergies"] == "Dust, Penicillin"

    # 5. Patient 1 GET their own profile
    get_res = client.get(
        f"/patients/{p1_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert get_res.status_code == 200
    assert get_res.json()["data"]["city"] == "Bengaluru"

    # 6. Patient 1 tries to update Patient 2 profile -> 403
    unauth_put = client.put(
        f"/patients/{p2_id}",
        headers={"Authorization": f"Bearer {token1}"},
        json={"city": "Hacked City"}
    )
    assert unauth_put.status_code == 403

    # 7. Patient 1 tries to view Patient 2 profile -> 403
    unauth_get = client.get(
        f"/patients/{p2_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert unauth_get.status_code == 403

    # 8. Doctor can view Patient 1 profile -> 200
    doc_get = client.get(
        f"/patients/{p1_id}",
        headers={"Authorization": f"Bearer {token_doc}"}
    )
    assert doc_get.status_code == 200
    assert doc_get.json()["data"]["name"] == "Patient One"

    # 9. Doctor cannot update Patient 1 profile -> 403
    doc_put = client.put(
        f"/patients/{p1_id}",
        headers={"Authorization": f"Bearer {token_doc}"},
        json={"city": "Doctor Edited"}
    )
    assert doc_put.status_code == 403

    # 10. Non-existent patient -> 404
    not_found = client.get(
        "/patients/99999",
        headers={"Authorization": f"Bearer {token_doc}"}
    )
    assert not_found.status_code == 404
