"""
Workflow Context models.
Central state object passed between all agents.
This object is IMMUTABLE. Agents must return a new copy with updated fields.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
import uuid
from .workflow_status import WorkflowStatus

class ImmutableModel(BaseModel):
    model_config = ConfigDict(frozen=True)

class ToolExecution(ImmutableModel):
    tool_name: str
    arguments: Dict[str, Any]
    execution_time_ms: float
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentExecutionMetadata(ImmutableModel):
    agent_name: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    processing_time_ms: Optional[float] = None
    status: str
    tool_calls: List[ToolExecution] = Field(default_factory=list)
    llm_tokens: Optional[int] = None
    errors: List[str] = Field(default_factory=list)

class MetadataContext(ImmutableModel):
    workflow_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    context_version: str = "1.0"
    reminder_id: Optional[str] = None
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    workflow_status: WorkflowStatus = WorkflowStatus.CREATED
    current_agent: str = "reminder_manager"
    next_agent: Optional[str] = None
    execution_history: List[AgentExecutionMetadata] = Field(default_factory=list)

class ReminderContext(ImmutableModel):
    title: str
    description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    priority: int = 1
    category: str
    urgency: Optional[str] = None

class ActivityContext(ImmutableModel):
    website: Optional[str] = None
    active_tab: Optional[str] = None
    application: Optional[str] = None
    browser: Optional[str] = None
    video_playing: Optional[bool] = None
    meeting_detected: Optional[bool] = None
    idle: Optional[bool] = None
    device_type: Optional[str] = None
    confidence_score: Optional[float] = None

class CalendarContext(ImmutableModel):
    meeting_now: Optional[bool] = None
    next_meeting: Optional[datetime] = None
    busy_until: Optional[datetime] = None
    calendar_available: Optional[bool] = None

class LearningContext(ImmutableModel):
    completion_rate: Optional[float] = None
    average_response_time: Optional[float] = None
    ignored_reminders: Optional[int] = None
    preferred_reminder_time: Optional[str] = None
    historical_patterns: Dict[str, Any] = Field(default_factory=dict)

class EngagementContext(ImmutableModel):
    generated_message: Optional[str] = None
    delivery_style: Optional[str] = None
    tone: Optional[str] = None
    notification_type: Optional[str] = None
    personalization_score: Optional[float] = None

class DecisionContext(ImmutableModel):
    recommended_action: Optional[str] = None
    reason: Optional[str] = None
    delivery_channel: Optional[str] = None
    deliver_now: Optional[bool] = None
    retry_after: Optional[datetime] = None

class AnalyticsContext(ImmutableModel):
    processing_time: Optional[float] = None
    agents_executed: int = 0
    tool_calls: int = 0
    errors: int = 0

class WorkflowContext(ImmutableModel):
    """
    Central WorkflowContext. Passed between all ADK agents.
    Agents should only update their respective sections by returning a new copy:
    updated_context = context.model_copy(update={"activity": new_activity_context})
    """
    metadata: MetadataContext
    reminder: ReminderContext
    activity: Optional[ActivityContext] = None
    calendar: Optional[CalendarContext] = None
    learning: Optional[LearningContext] = None
    engagement: Optional[EngagementContext] = None
    decision: Optional[DecisionContext] = None
    analytics: AnalyticsContext = Field(default_factory=AnalyticsContext)
