import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, future=True
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

app = create_app()


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def prepare_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_and_get_item():
    payload = {"title": "Test Item", "description": "Descripción de prueba"}
    response = client.post("/api/v1/items/", json=payload)
    assert response.status_code == 201
    item = response.json()
    assert item["title"] == payload["title"]

    response = client.get(f"/api/v1/items/{item['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == item["id"]


def test_update_item():
    response = client.post("/api/v1/items/", json={"title": "Old", "description": "Old desc"})
    item = response.json()

    update_response = client.put(
        f"/api/v1/items/{item['id']}", json={"title": "Updated", "description": "Updated desc"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated"


def test_delete_item():
    response = client.post("/api/v1/items/", json={"title": "To Delete", "description": "Eliminar"})
    item_id = response.json()["id"]

    delete_response = client.delete(f"/api/v1/items/{item_id}")
    assert delete_response.status_code == 204
    assert client.get(f"/api/v1/items/{item_id}").status_code == 404
