# tests/test_tasks.py
from fastapi.testclient import TestClient
import pytest
from app.schemas import TaskCreate

def test_create_task(client):
    task_data = {
        "title": "Test Task",
        "description": "Test Description"
    }
    
    response = client.post("/api/tasks", json=task_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert "id" in data
    assert data["is_completed"] == False

def test_get_tasks(client):
    # Create some test tasks
    task_data = [
        {"title": "Task 1", "description": "Description 1"},
        {"title": "Task 2", "description": "Description 2"},
        {"title": "Task 3", "description": "Description 3"}
    ]
    
    for task in task_data:
        client.post("/api/tasks", json=task)
    
    response = client.get("/api/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 5  # Verify limit works
    assert all(isinstance(task["id"], int) for task in data)

def test_complete_task(client):
    # Create a task first
    task_data = {"title": "Test Task", "description": "Test Description"}
    create_response = client.post("/api/tasks", json=task_data)
    task_id = create_response.json()["id"]
    
    # Complete the task
    response = client.put(f"/api/tasks/{task_id}/complete")
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] == True
    assert data["completed_at"] is not None

def test_complete_nonexistent_task(client):
    response = client.put("/api/tasks/999/complete")
    assert response.status_code == 404