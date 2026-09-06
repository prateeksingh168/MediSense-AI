from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["version"] == "1.0.0"


def test_docs_accessible():
    response = client.get("/docs")
    assert response.status_code == 200

    openapi_res = client.get("/openapi.json")
    assert openapi_res.status_code == 200
    openapi_json = openapi_res.json()
    assert "paths" in openapi_json
