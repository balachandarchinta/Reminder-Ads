"""
Unit tests for the Activity Agent.
"""
# Mock google_adk before importing the agent
import sys
from unittest.mock import MagicMock

class StubModelConfig:
    def __init__(self, *args, **kwargs):
        pass

class StubAgent:
    def __init__(self, *args, **kwargs):
        self.name = kwargs.get("name", "agent")
        self.instructions = kwargs.get("instructions", "")
        self.registered_tools = []
    def register_tool(self, tool):
        self.registered_tools.append(tool)

m_google_adk = MagicMock()
m_google_adk.Agent = StubAgent
m_google_adk.ModelConfig = StubModelConfig
sys.modules['google_adk'] = m_google_adk

# Now import pytest and models
import pytest
from backend.app.models.workflow_context import WorkflowContext, MetadataContext, ReminderContext
from backend.app.models.workflow_status import WorkflowStatus
from backend.agents.activity_agent.agent import ActivityAgent

def test_activity_agent_enrichment():
    # Arrange
    metadata = MetadataContext(user_id="user123", current_agent="activity_agent")
    reminder = ReminderContext(title="Test", category="general")
    context = WorkflowContext(metadata=metadata, reminder=reminder)
    agent = ActivityAgent()

    # Act
    updated_context = agent.analyze_activity(context)

    # Assert
    assert updated_context.activity is not None
    assert updated_context.activity.website == "https://example.com"
    assert updated_context.activity.idle is False
    assert updated_context.activity.confidence_score == 0.95
    
    assert updated_context.metadata.workflow_status == WorkflowStatus.ACTIVITY_ANALYZED
    assert updated_context.metadata.next_agent == "scheduler_agent"
    
    # Check tool execution metadata
    assert len(updated_context.metadata.execution_history) == 1
    exec_meta = updated_context.metadata.execution_history[-1]
    assert exec_meta.agent_name == "activity_agent"
    assert len(exec_meta.tool_calls) == 3
