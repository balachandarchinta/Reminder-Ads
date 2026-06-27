"""
Service layer for the Decision Agent.
"""
import logging
from datetime import datetime
from backend.app.models.workflow_context import WorkflowContext
from backend.app.models.workflow_status import WorkflowStatus
from .agent import DecisionAgent

logger = logging.getLogger(__name__)

class DecisionAgentService:
    def __init__(self, agent: DecisionAgent):
        self.agent = agent

    def process_context(self, context: WorkflowContext) -> WorkflowContext:
        """
        Delegates delivery evaluation to the Decision ADK agent.
        """
        workflow_id = context.metadata.workflow_id
        try:
            return self.agent.evaluate_decision(context)
        except Exception as e:
            logger.error(f"Decision Agent Error: {e}", extra={"workflow_id": workflow_id})
            error_metadata = context.metadata.model_copy(update={
                "workflow_status": WorkflowStatus.FAILED,
                "updated_at": datetime.utcnow()
            })
            return context.model_copy(update={"metadata": error_metadata})
