"""
FastAPI route for reminders.
"""
from fastapi import APIRouter, Depends
from backend.agents.reminder_manager.models import ReminderRequest
from backend.app.models.workflow_context import WorkflowContext
from backend.agents.reminder_manager.service import ReminderManagerService
from backend.agents.reminder_manager.repository import InMemoryWorkflowRepository, AbstractWorkflowRepository
from backend.agents.reminder_manager.agent import ReminderManagerAgent

router = APIRouter()

# Dependency injection
def get_workflow_repository() -> AbstractWorkflowRepository:
    return InMemoryWorkflowRepository()

def get_reminder_manager_agent() -> ReminderManagerAgent:
    return ReminderManagerAgent()

def get_reminder_manager_service(
    repo: AbstractWorkflowRepository = Depends(get_workflow_repository),
    agent: ReminderManagerAgent = Depends(get_reminder_manager_agent)
) -> ReminderManagerService:
    return ReminderManagerService(repository=repo, agent=agent)

@router.post("/start", response_model=WorkflowContext)
async def start_reminder(
    request: ReminderRequest,
    service: ReminderManagerService = Depends(get_reminder_manager_service)
):
    return service.process_reminder_request(request)
