"""
ADK Agent definition for the Decision Agent.
"""
import logging
import time
from datetime import datetime, timedelta
from google_adk import Agent, ModelConfig
from .instructions import DECISION_AGENT_PROMPT
from backend.app.models.workflow_context import (
    WorkflowContext, 
    AgentExecutionMetadata, 
    DecisionContext, 
    ToolExecution
)
from backend.app.models.workflow_status import WorkflowStatus
from backend.mcp.server import server as mcp_server

logger = logging.getLogger(__name__)

class DecisionAgent(Agent):
    """
    The Decision Agent. Evaluates reminder delivery conditions
    using browser context, user preferences, and structured rules.
    """
    def __init__(self):
        super().__init__(
            name="decision_agent",
            instructions=DECISION_AGENT_PROMPT,
            model=ModelConfig(provider="vertex_ai", model="gemini-pro"),
        )
        self.register_tool(self.evaluate_decision)

    def evaluate_decision(self, context: WorkflowContext) -> WorkflowContext:
        """
        Agent tool to evaluate delivery, invoke MCP preference and notification tools,
        and enrich DecisionContext.
        """
        workflow_id = context.metadata.workflow_id
        logger.info(f"Agent Invoked: {self.name}", extra={"workflow_id": workflow_id})
        
        start_time = datetime.utcnow()
        tool_calls = []
        
        # 1. Fetch user preferences
        t_start = time.time()
        user_id = context.metadata.user_id
        preferences = mcp_server.call_tool("get_preferences", user_id=user_id)
        t_ms = (time.time() - t_start) * 1000
        tool_calls.append(ToolExecution(
            tool_name="get_preferences", arguments={"user_id": user_id}, execution_time_ms=t_ms, status="SUCCESS"
        ))
        
        # 2. Retrieve inputs
        priority = context.reminder.priority
        activity = context.activity
        
        deliver_now = False
        notification_type = "desktop"
        delivery_channel = "browser_extension"
        retry_after = None
        reason = "Default processing"
        
        if activity:
            website = activity.website or ""
            idle = activity.idle
            video_playing = activity.video_playing
            
            # Decision Rules
            if priority >= 2 and idle:
                deliver_now = True
                reason = "High priority reminder and user is idle."
            elif video_playing:
                deliver_now = True
                notification_type = "overlay"
                reason = "User is watching a video; overlay used to minimize disruption."
            elif any(work_term in website.lower() for work_term in ["work", "github", "docs", "jira"]):
                deliver_now = True
                notification_type = "banner"
                reason = "User is actively working; banner notification used."
            elif priority < 2 and not idle:
                deliver_now = False
                retry_after = datetime.utcnow() + timedelta(minutes=10)
                reason = "Low priority reminder and user is busy. Retrying in 10 minutes."
            else:
                deliver_now = True
                reason = "Standard delivery conditions met."
        else:
            deliver_now = True
            reason = "No activity context available; defaulting to immediate delivery."
            
        # 3. Invoke notification tool in mock mode if delivering now
        if deliver_now:
            t_start = time.time()
            notify_message = f"Reminder: {context.reminder.title}"
            
            if notification_type == "banner":
                notify_result = mcp_server.call_tool("send_banner", message=notify_message)
                notify_tool = "send_banner"
                notify_args = {"message": notify_message}
            elif notification_type == "overlay":
                notify_result = mcp_server.call_tool("send_overlay", message=notify_message)
                notify_tool = "send_overlay"
                notify_args = {"message": notify_message}
            else:
                notify_result = mcp_server.call_tool("send_desktop_notification", title=context.reminder.title, message=notify_message)
                notify_tool = "send_desktop_notification"
                notify_args = {"title": context.reminder.title, "message": notify_message}
                
            t_ms = (time.time() - t_start) * 1000
            tool_calls.append(ToolExecution(
                tool_name=notify_tool, arguments=notify_args, execution_time_ms=t_ms, status="SUCCESS"
            ))
            logger.info("Notification sent via MCP", extra={"type": notification_type})

        decision_context = DecisionContext(
            recommended_action="deliver" if deliver_now else "delay",
            reason=reason,
            delivery_channel=delivery_channel,
            deliver_now=deliver_now,
            retry_after=retry_after
        )
        
        # 4. Generate Execution Metadata
        execution_meta = AgentExecutionMetadata(
            agent_name=self.name,
            started_at=start_time,
            completed_at=datetime.utcnow(),
            status="SUCCESS",
            tool_calls=tool_calls,
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )
        
        # 5. Update WorkflowContext
        updated_history = list(context.metadata.execution_history) + [execution_meta]
        
        updated_metadata = context.metadata.model_copy(update={
            "workflow_status": WorkflowStatus.DECISION_READY,
            "current_agent": self.name,
            "next_agent": None,  # End of workflow pipeline
            "updated_at": datetime.utcnow(),
            "execution_history": updated_history
        })
        
        updated_context = context.model_copy(update={
            "metadata": updated_metadata,
            "decision": decision_context
        })
        
        logger.info(f"Decision completed: {reason}", extra={
            "workflow_id": workflow_id,
            "deliver_now": deliver_now,
            "notification_type": notification_type
        })
        return updated_context

agent = DecisionAgent()
