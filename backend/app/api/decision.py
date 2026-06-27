"""
FastAPI route for Decision Agent.
"""
from fastapi import APIRouter, Depends
from backend.app.models.workflow_context import WorkflowContext
from backend.agents.decision_agent.service import DecisionAgentService
from backend.agents.decision_agent.agent import DecisionAgent

router = APIRouter()

def get_decision_agent() -> DecisionAgent:
    return DecisionAgent()

def get_decision_agent_service(agent: DecisionAgent = Depends(get_decision_agent)) -> DecisionAgentService:
    return DecisionAgentService(agent=agent)

@router.post("/evaluate", response_model=WorkflowContext)
async def evaluate_decision(
    context: WorkflowContext,
    service: DecisionAgentService = Depends(get_decision_agent_service)
):
    return service.process_context(context)
