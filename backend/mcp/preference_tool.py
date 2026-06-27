"""
Preference Tool implementation for MCP Server.
"""
from typing import Dict, Any
from .tool_registry import mcp_tool

@mcp_tool("get_preferences")
def get_preferences(user_id: str) -> Dict[str, Any]:
    """Mock tool to fetch user preferences."""
    return {
        "user_id": user_id,
        "quiet_hours_start": "22:00",
        "quiet_hours_end": "07:00",
        "allow_banners": True,
        "allow_overlays": True
    }
