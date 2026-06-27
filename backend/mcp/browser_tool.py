"""
Browser Context Tool implementation for MCP Server.
"""
from typing import Dict, Any
from .tool_registry import mcp_tool

@mcp_tool("get_current_activity")
def get_current_activity() -> Dict[str, Any]:
    """Mock browser context: current user activity."""
    return {
        "activity": "reading",
        "idle": False,
        "active_application": "Chrome",
        "last_active": "0s ago"
    }

@mcp_tool("get_active_tab")
def get_active_tab() -> Dict[str, Any]:
    """Mock browser context: active browser tab."""
    return {
        "title": "Example Domain",
        "url": "https://example.com",
        "domain": "example.com"
    }

@mcp_tool("get_browser_state")
def get_browser_state() -> Dict[str, Any]:
    """Mock browser context: overall browser state."""
    return {
        "video_playing": False,
        "audio_playing": False,
        "fullscreen": True,
        "device_type": "desktop"
    }

