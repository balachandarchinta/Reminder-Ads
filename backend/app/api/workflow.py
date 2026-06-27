"""
FastAPI route for Workflow Orchestrator.
Exposes the complete workflow pipeline.
"""
from fastapi import APIRouter, Depends
from backend.agents.reminder_manager.models import ReminderRequest
from backend.app.models.workflow_context import WorkflowContext
from backend.agents.reminder_manager.service import ReminderManagerService
from backend.agents.reminder_manager.repository import InMemoryWorkflowRepository, AbstractWorkflowRepository
from backend.agents.reminder_manager.agent import ReminderManagerAgent

from backend.agents.activity_agent.service import ActivityAgentService
from backend.agents.activity_agent.agent import ActivityAgent

from backend.agents.decision_agent.service import DecisionAgentService
from backend.agents.decision_agent.agent import DecisionAgent

router = APIRouter()

# Share repositories/agents to simulate DI lifecycle
_repo = InMemoryWorkflowRepository()
_rm_agent = ReminderManagerAgent()
_activity_agent = ActivityAgent()
_decision_agent = DecisionAgent()

def get_reminder_service() -> ReminderManagerService:
    return ReminderManagerService(repository=_repo, agent=_rm_agent)

def get_activity_service() -> ActivityAgentService:
    return ActivityAgentService(agent=_activity_agent)

def get_decision_service() -> DecisionAgentService:
    return DecisionAgentService(agent=_decision_agent)

@router.post("/execute", response_model=WorkflowContext)
async def execute_workflow(
    request: ReminderRequest,
    rm_service: ReminderManagerService = Depends(get_reminder_service),
    activity_service: ActivityAgentService = Depends(get_activity_service),
    decision_service: DecisionAgentService = Depends(get_decision_service)
):
    """
    Orchestrates the entire multi-agent workflow:
    1. Reminder Manager initializes WorkflowContext
    2. Activity Agent enriches digital activity
    3. Decision Agent determines delivery decisions
    """
    # Step 1: Initialize workflow context
    context = rm_service.process_reminder_request(request)
    
    # Step 2: Enrich with Activity Context
    context = activity_service.process_context(context)
    
    # Step 3: Evaluate delivery Decision
    final_context = decision_service.process_context(context)
    
    return final_context
