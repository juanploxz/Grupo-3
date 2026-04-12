from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_matching_returns_ranked_vacancies() -> None:
    response = client.get("/api/v1/matching/candidate-1")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload) >= 1
    assert payload[0]["score"] >= payload[-1]["score"]
