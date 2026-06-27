"""
MCP Server implementation for ReminderAds.
"""
import logging
from .tool_registry import registry
# Import tools to ensure they are registered
import backend.mcp.reminder_tool
import backend.mcp.browser_tool
import backend.mcp.notification_tool
import backend.mcp.preference_tool

logger = logging.getLogger(__name__)

class MCPServer:
    """
    Main MCP Server exposing the registry.
    """
    def __init__(self):
        self.registry = registry

    def list_tools(self):
        return list(self.registry._tools.keys())

    def call_tool(self, tool_name: str, **kwargs):
        return self.registry.invoke(tool_name, **kwargs)

server = MCPServer()
