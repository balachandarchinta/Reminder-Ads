"""
FastAPI route for Activity Agent.
"""
from fastapi import APIRouter, Depends
from backend.app.models.workflow_context import WorkflowContext
from backend.agents.activity_agent.service import ActivityAgentService
from backend.agents.activity_agent.agent import ActivityAgent

router = APIRouter()

def get_activity_agent() -> ActivityAgent:
    return ActivityAgent()

def get_activity_agent_service(agent: ActivityAgent = Depends(get_activity_agent)) -> ActivityAgentService:
    return ActivityAgentService(agent=agent)

@router.post("/analyze", response_model=WorkflowContext)
async def analyze_activity(
    context: WorkflowContext,
    service: ActivityAgentService = Depends(get_activity_agent_service)
):
    return service.process_context(context)
