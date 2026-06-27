"""
Unit tests for the Decision Agent.
"""
import sys
from unittest.mock import MagicMock

# Mock google_adk
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

import pytest
from backend.app.models.workflow_context import WorkflowContext, MetadataContext, ReminderContext, ActivityContext
from backend.app.models.workflow_status import WorkflowStatus
from backend.agents.decision_agent.agent import DecisionAgent

def test_decision_agent_evaluation():
    # Arrange
    metadata = MetadataContext(user_id="user123", current_agent="activity_agent")
    reminder = ReminderContext(title="Check email", category="work", priority=2)
    activity = ActivityContext(website="github.com/pulls", idle=True, video_playing=False)
    
    context = WorkflowContext(metadata=metadata, reminder=reminder, activity=activity)
    agent = DecisionAgent()

    # Act
    updated_context = agent.evaluate_decision(context)

    # Assert
    assert updated_context.decision is not None
    assert updated_context.decision.deliver_now is True
    assert updated_context.decision.recommended_action == "deliver"
    assert updated_context.metadata.workflow_status == WorkflowStatus.DECISION_READY
    assert updated_context.metadata.next_agent is None
    
    # Verify execution history
    exec_meta = updated_context.metadata.execution_history[-1]
    assert exec_meta.agent_name == "decision_agent"
    assert len(exec_meta.tool_calls) == 2  # get_preferences & notification tool
