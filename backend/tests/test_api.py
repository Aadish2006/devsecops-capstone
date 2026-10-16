"""
OpsDesk Helpdesk & Incident Response API test suite.
Uses an in-memory/isolated SQLite database so production PostgreSQL is never touched.
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
    assert data["service"] == "OpsDesk Helpdesk API"
    assert "version" in data


# ── Test 3: Create an incident ticket via POST ──
def test_create_ticket():
    response = client.post("/api/tickets", json={
        "title": "P1 Production Ingress Latency Spike",
        "description": "High HTTP 504 gateway timeouts observed in ap-south-1",
        "priority": "HIGH",
        "assignee": "Aadish",
        "status": "OPEN",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "P1 Production Ingress Latency Spike"
    assert data["priority"] == "HIGH"
    assert "id" in data
    assert "created_at" in data


# ── Test 4: List all tickets via GET ──
def test_list_tickets():
    response = client.get("/api/tickets")
    assert response.status_code == 200
    tickets = response.json()
    assert isinstance(tickets, list)
    assert len(tickets) >= 1


# ── Test 5: Get a single ticket by ID ──
def test_get_ticket_by_id():
    create_resp = client.post("/api/tickets", json={"title": "SSL Certificate Renewal Required"})
    ticket_id = create_resp.json()["id"]

    response = client.get(f"/api/tickets/{ticket_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "SSL Certificate Renewal Required"


# ── Test 6: Update a ticket via PUT ──
def test_update_ticket():
    create_resp = client.post("/api/tickets", json={"title": "Database connection pool exhaustion"})
    ticket_id = create_resp.json()["id"]

    response = client.put(f"/api/tickets/{ticket_id}", json={
        "title": "Database pool limit increased",
        "status": "IN_PROGRESS",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Database pool limit increased"
    assert data["status"] == "IN_PROGRESS"


# ── Test 7: Delete a ticket via DELETE ──
def test_delete_ticket():
    create_resp = client.post("/api/tickets", json={"title": "Transient node reboot alert"})
    ticket_id = create_resp.json()["id"]

    response = client.delete(f"/api/tickets/{ticket_id}")
    assert response.status_code == 204

    # Verify ticket is actually removed
    get_resp = client.get(f"/api/tickets/{ticket_id}")
    assert get_resp.status_code == 404


# ── Test 8: Ticket stats endpoint ──
def test_stats():
    response = client.get("/api/tickets/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "open" in data
    assert "inProgress" in data
    assert "resolved" in data
    assert data["total"] >= 0


# ── Test 9: Creating a ticket with an empty title is rejected ──
def test_create_ticket_empty_title_rejected():
    response = client.post("/api/tickets", json={"title": ""})
    assert response.status_code == 422


# ── Test 10: Requesting a non-existent ticket returns 404 ──
def test_get_nonexistent_ticket():
    response = client.get("/api/tickets/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Ticket not found"


# ── Test 11: Backward compatibility alias for /api/tasks ──
def test_legacy_task_alias_endpoint():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
