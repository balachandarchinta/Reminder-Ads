"""
ADK Agent definition for the Activity Agent.
"""
import logging
import time
from datetime import datetime
from google_adk import Agent, ModelConfig
from .instructions import ACTIVITY_AGENT_PROMPT
from backend.app.models.workflow_context import (
    WorkflowContext, 
    AgentExecutionMetadata, 
    ActivityContext, 
    ToolExecution
)
from backend.app.models.workflow_status import WorkflowStatus
from backend.mcp.server import server as mcp_server

logger = logging.getLogger(__name__)

class ActivityAgent(Agent):
    """
    The Activity Agent. Responsible for enriching the WorkflowContext
    with browser activity data retrieved via the MCP Server.
    """
    def __init__(self):
        super().__init__(
            name="activity_agent",
            instructions=ACTIVITY_AGENT_PROMPT,
            model=ModelConfig(provider="vertex_ai", model="gemini-pro"),
        )
        self.register_tool(self.analyze_activity)

    def analyze_activity(self, context: WorkflowContext) -> WorkflowContext:
        """
        Agent tool to retrieve activity data and enrich the context.
        """
        workflow_id = context.metadata.workflow_id
        logger.info(f"Agent Invoked: {self.name}", extra={"workflow_id": workflow_id})
        
        start_time = datetime.utcnow()
        tool_calls = []
        
        # 1. Fetch data from MCP Server
        # get_current_activity
        t_start = time.time()
        activity_data = mcp_server.call_tool("get_current_activity")
        t_ms = (time.time() - t_start) * 1000
        tool_calls.append(ToolExecution(
            tool_name="get_current_activity", arguments={}, execution_time_ms=t_ms, status="SUCCESS"
        ))
        
        # get_active_tab
        t_start = time.time()
        tab_data = mcp_server.call_tool("get_active_tab")
        t_ms = (time.time() - t_start) * 1000
        tool_calls.append(ToolExecution(
            tool_name="get_active_tab", arguments={}, execution_time_ms=t_ms, status="SUCCESS"
        ))
        
        # get_browser_state
        t_start = time.time()
        browser_data = mcp_server.call_tool("get_browser_state")
        t_ms = (time.time() - t_start) * 1000
        tool_calls.append(ToolExecution(
            tool_name="get_browser_state", arguments={}, execution_time_ms=t_ms, status="SUCCESS"
        ))
        
        # 2. Populate ActivityContext
        activity_context = ActivityContext(
            website=tab_data.get("url"),
            active_tab=tab_data.get("title"),
            browser="Chrome",
            application="Browser",
            video_playing=browser_data.get("video_playing"),
            idle=activity_data.get("idle"),
            device_type=browser_data.get("device_type"),
            confidence_score=0.95 # Mock confidence
        )
        
        logger.info("Browser Activity Fetched", extra={"activity": activity_data})
        
        # 3. Create Execution Metadata
        execution_meta = AgentExecutionMetadata(
            agent_name=self.name,
            started_at=start_time,
            completed_at=datetime.utcnow(),
            status="SUCCESS",
            tool_calls=tool_calls,
            processing_time_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
        )
        
        # 4. Update WorkflowContext
        updated_history = list(context.metadata.execution_history) + [execution_meta]
        
        updated_metadata = context.metadata.model_copy(update={
            "workflow_status": WorkflowStatus.ACTIVITY_ANALYZED,
            "current_agent": self.name,
            "next_agent": "scheduler_agent",
            "updated_at": datetime.utcnow(),
            "execution_history": updated_history
        })
        
        updated_context = context.model_copy(update={
            "metadata": updated_metadata,
            "activity": activity_context
        })
        
        logger.info("Activity Analysis Completed", extra={"workflow_id": workflow_id})
        return updated_context

agent = ActivityAgent()
