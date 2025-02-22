# app/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    completed_at: Optional[datetime]
    is_completed: bool

    class Config:
        from_attributes = True