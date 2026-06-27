"""
Local models for Reminder Manager.
(WorkflowState has been replaced by the shared WorkflowContext)
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ReminderRequest(BaseModel):
    title: str = Field(..., description="Title of the reminder")
    description: Optional[str] = Field(None, description="Detailed description")
    time: Optional[datetime] = Field(None, description="Optional fixed time for the reminder")
    priority: int = Field(default=1, description="Priority level of the reminder")
    category: str = Field(..., description="Category of the reminder")
    user_id: str = Field(..., description="ID of the user creating the reminder")
