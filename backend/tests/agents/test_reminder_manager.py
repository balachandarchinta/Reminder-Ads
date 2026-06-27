"""
Basic unit test for the Reminder Manager Agent.
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

import pytest
from backend.agents.reminder_manager.models import ReminderRequest
from backend.agents.reminder_manager.agent import ReminderManagerAgent
from backend.agents.reminder_manager.repository import InMemoryWorkflowRepository
from backend.agents.reminder_manager.service import ReminderManagerService
from backend.app.models.workflow_status import WorkflowStatus

def test_reminder_manager_orchestration():
    # Arrange
    req = ReminderRequest(
        title="Test Reminder",
        category="general",
        user_id="user123"
    )
    repo = InMemoryWorkflowRepository()
    agent = ReminderManagerAgent()
    service = ReminderManagerService(repository=repo, agent=agent)

    # Act
    context = service.process_reminder_request(req)

    # Assert
    assert context.metadata.workflow_id is not None
    assert context.metadata.workflow_status == WorkflowStatus.VALIDATED
    assert context.metadata.current_agent == "reminder_manager"
    assert context.metadata.next_agent == "activity_agent"
