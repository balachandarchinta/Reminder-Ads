"""
Browser Context Tool implementation for MCP Server.
"""
from typing import Dict, Any
from .tool_registry import mcp_tool
from backend.app.api.extension import latest_activity

@mcp_tool("get_current_activity")
def get_current_activity() -> Dict[str, Any]:
    """Mock browser context: current user activity."""
    return {
        "activity": "reading",
        "idle": latest_activity.get("idle", False),
        "active_application": "Chrome",
        "last_active": "0s ago"
    }

@mcp_tool("get_active_tab")
def get_active_tab() -> Dict[str, Any]:
    """Mock browser context: active browser tab."""
    website = latest_activity.get("website", "https://example.com")
    domain = "example.com"
    if "://" in website:
        parts = website.split("/")
        if len(parts) > 2:
            domain = parts[2]
            
    return {
        "title": latest_activity.get("active_tab", "Example Domain"),
        "url": website,
        "domain": domain
    }

@mcp_tool("get_browser_state")
def get_browser_state() -> Dict[str, Any]:
    """Mock browser context: overall browser state."""
    return {
        "video_playing": latest_activity.get("video_playing", False),
        "audio_playing": False,
        "fullscreen": True,
        "device_type": "desktop"
    }
