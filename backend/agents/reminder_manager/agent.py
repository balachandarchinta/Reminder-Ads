"""
ADK Agent definition for the Reminder Manager.
"""
import logging
from datetime import datetime
from google_adk import Agent, ModelConfig
from .instructions import REMINDER_MANAGER_PROMPT
from backend.app.models.workflow_context import WorkflowContext, AgentExecutionMetadata
from backend.app.models.workflow_status import WorkflowStatus

logger = logging.getLogger(__name__)

class ReminderManagerAgent(Agent):
    """
    The Reminder Manager ADK Agent.
    Executable via `adk run` or `adk web`.
    """
    def __init__(self):
        super().__init__(
            name="reminder_manager",
            instructions=REMINDER_MANAGER_PROMPT,
            model=ModelConfig(provider="vertex_ai", model="gemini-pro"),
        )
        self.register_tool(self.route_workflow)

    def route_workflow(self, context: WorkflowContext) -> WorkflowContext:
        """
        Agent tool to route the workflow to the next appropriate agent.
        Returns an updated Immutable WorkflowContext.
        """
        workflow_id = context.metadata.workflow_id
        logger.info(f"Agent Invoked: {self.name}", extra={"workflow_id": workflow_id})
        
        start_time = datetime.utcnow()
        
        # Determine next agent (static logic for now)
        next_agent_name = "activity_agent"
        
        # Create Execution Metadata
        execution_meta = AgentExecutionMetadata(
            agent_name=self.name,
            started_at=start_time,
            completed_at=datetime.utcnow(),
            status="SUCCESS"
        )
        
        # Update metadata by copying immutable structures
        updated_history = list(context.metadata.execution_history) + [execution_meta]
        
        updated_metadata = context.metadata.model_copy(update={
            "workflow_status": WorkflowStatus.VALIDATED,
            "next_agent": next_agent_name,
            "updated_at": datetime.utcnow(),
            "execution_history": updated_history
        })
        
        # Return new context
        updated_context = context.model_copy(update={
            "metadata": updated_metadata
        })
        
        logger.info(f"Next Agent Selected: {next_agent_name}", extra={"workflow_id": workflow_id})
        return updated_context

agent = ReminderManagerAgent()
