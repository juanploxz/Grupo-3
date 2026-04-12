from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_profile() -> None:
    response = client.get("/api/v1/profiles/candidate-1")
    assert response.status_code == 200
    assert response.json()["id"] == "candidate-1"
