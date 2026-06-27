"""
Workflow Events models.
"""
from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel, Field
import uuid

class BaseEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WorkflowStartedEvent(BaseEvent):
    user_id: str
    initial_context: Dict[str, Any]

class AgentStartedEvent(BaseEvent):
    agent_name: str

class AgentCompletedEvent(BaseEvent):
    agent_name: str
    processing_time_ms: float
    status: str

class WorkflowCompletedEvent(BaseEvent):
    final_status: str

class WorkflowFailedEvent(BaseEvent):
    error_reason: str
