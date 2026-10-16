"""
TaskBoard API test suite.
Uses an in-memory SQLite database so production PostgreSQL is never touched.
"""
import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import engine, Base
from app import models  # ensure all models are registered with Base


@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    """Create all tables before the test session and drop them after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


# ── Test 1: Health endpoint returns UP ──
def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "UP"}


# ── Test 2: Root endpoint returns service info ──
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "TaskBoard API"
    assert "version" in data


# ── Test 3: Create a task via POST ──
def test_create_task():
    response = client.post("/api/tasks", json={
        "title": "Deploy application",
        "priority": "HIGH",
        "assignee": "Aadish",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Deploy application"
    assert data["priority"] == "HIGH"
    assert "id" in data
    assert "created_at" in data


# ── Test 4: List all tasks via GET ──
def test_list_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)
    assert len(tasks) >= 1


# ── Test 5: Get a single task by ID ──
def test_get_task_by_id():
    create_resp = client.post("/api/tasks", json={"title": "Test get by ID"})
    task_id = create_resp.json()["id"]

    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test get by ID"


# ── Test 6: Update a task via PUT ──
def test_update_task():
    create_resp = client.post("/api/tasks", json={"title": "Before update"})
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "title": "After update",
        "status": "IN_PROGRESS",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "After update"
    assert data["status"] == "IN_PROGRESS"


# ── Test 7: Delete a task via DELETE ──
def test_delete_task():
    create_resp = client.post("/api/tasks", json={"title": "To be deleted"})
    task_id = create_resp.json()["id"]

    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 204

    # Verify task is actually removed
    get_resp = client.get(f"/api/tasks/{task_id}")
    assert get_resp.status_code == 404


# ── Test 8: Task stats endpoint ──
def test_stats():
    response = client.get("/api/tasks/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "todo" in data
    assert "inProgress" in data
    assert "done" in data
    assert data["total"] >= 0


# ── Test 9: Creating a task with an empty title is rejected ──
def test_create_task_empty_title_rejected():
    response = client.post("/api/tasks", json={"title": ""})
    assert response.status_code == 422


# ── Test 10: Requesting a non-existent task returns 404 ──
def test_get_nonexistent_task():
    response = client.get("/api/tasks/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"
