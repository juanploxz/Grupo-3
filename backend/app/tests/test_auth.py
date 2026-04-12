from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login_default_candidate() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "juan@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert response.json()["candidate_id"] == "candidate-1"
