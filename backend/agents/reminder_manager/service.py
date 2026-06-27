"""
Service layer for the Reminder Manager.
"""
import logging
from datetime import datetime
from .models import ReminderRequest
from backend.app.models.workflow_context import WorkflowContext, MetadataContext, ReminderContext
from .repository import AbstractWorkflowRepository
from .agent import ReminderManagerAgent
from backend.app.models.workflow_status import WorkflowStatus

logger = logging.getLogger(__name__)

class ReminderManagerService:
    def __init__(self, repository: AbstractWorkflowRepository, agent: ReminderManagerAgent):
        self.repository = repository
        self.agent = agent

    def process_reminder_request(self, request: ReminderRequest) -> WorkflowContext:
        """
        Validates input, constructs the initial WorkflowContext, and delegates orchestration.
        """
        # Create initial contexts
        metadata = MetadataContext(
            user_id=request.user_id,
            workflow_status=WorkflowStatus.CREATED
        )
        
        reminder = ReminderContext(
            title=request.title,
            description=request.description,
            scheduled_time=request.time,
            priority=request.priority,
            category=request.category
        )
        
        # Build WorkflowContext
        context = WorkflowContext(
            metadata=metadata,
            reminder=reminder
        )
        
        workflow_id = context.metadata.workflow_id
        logger.info("Workflow Started", extra={"workflow_id": workflow_id})
        
        # Persist initial state
        self.repository.save(context)
        
        # Delegate to ADK Agent
        try:
            updated_context = self.agent.route_workflow(context)
            self.repository.save(updated_context)
            logger.info("Workflow Completed", extra={"workflow_id": workflow_id})
            return updated_context
        except Exception as e:
            logger.error(f"Errors during agent execution: {e}", extra={"workflow_id": workflow_id})
            
            error_metadata = context.metadata.model_copy(update={
                "workflow_status": WorkflowStatus.FAILED,
                "updated_at": datetime.utcnow()
            })
            failed_context = context.model_copy(update={"metadata": error_metadata})
            self.repository.save(failed_context)
            raise
