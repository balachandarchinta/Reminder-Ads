"""
Service layer for the Activity Agent.
"""
import logging
from datetime import datetime
from backend.app.models.workflow_context import WorkflowContext
from backend.app.models.workflow_status import WorkflowStatus
from .agent import ActivityAgent

logger = logging.getLogger(__name__)

class ActivityAgentService:
    def __init__(self, agent: ActivityAgent):
        self.agent = agent

    def process_context(self, context: WorkflowContext) -> WorkflowContext:
        """
        Delegates context enrichment to the Activity ADK agent.
        """
        workflow_id = context.metadata.workflow_id
        try:
            updated_context = self.agent.analyze_activity(context)
            return updated_context
        except Exception as e:
            logger.error(f"Activity Agent Error: {e}", extra={"workflow_id": workflow_id})
            error_metadata = context.metadata.model_copy(update={
                "workflow_status": WorkflowStatus.FAILED,
                "updated_at": datetime.utcnow()
            })
            failed_context = context.model_copy(update={"metadata": error_metadata})
            return failed_context
