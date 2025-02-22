# tests/test_database.py
from app.models import Task
from datetime import datetime

def test_create_task_in_db(db_session):
    task = Task(
        title="Test Task",
        description="Test Description"
    )
    db_session.add(task)
    db_session.commit()
    
    saved_task = db_session.query(Task).first()
    assert saved_task.title == "Test Task"
    assert saved_task.description == "Test Description"
    assert saved_task.is_completed == False
    assert saved_task.created_at is not None

def test_complete_task_in_db(db_session):
    task = Task(
        title="Test Task",
        description="Test Description"
    )
    db_session.add(task)
    db_session.commit()
    
    task.is_completed = True
    task.completed_at = datetime.now()
    db_session.commit()
    
    saved_task = db_session.query(Task).first()
    assert saved_task.is_completed == True
    assert saved_task.completed_at is not None