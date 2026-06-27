"""
Notification Tool implementation for MCP Server.
"""
from typing import Dict, Any
from .tool_registry import mcp_tool
from backend.app.api.extension import queue_notification

@mcp_tool("send_banner")
def send_banner(message: str) -> Dict[str, Any]:
    """Mock browser notification: Banner alert."""
    queue_notification("Reminder Alert", message)
    return {"status": "delivered", "type": "banner", "message": message}

@mcp_tool("send_overlay")
def send_overlay(message: str) -> Dict[str, Any]:
    """Mock browser notification: Full-screen overlay alert."""
    queue_notification("Important Alert", message)
    return {"status": "delivered", "type": "overlay", "message": message}

@mcp_tool("send_desktop_notification")
def send_desktop_notification(title: str, message: str) -> Dict[str, Any]:
    """Mock OS desktop notification."""
    queue_notification(title, message)
    return {"status": "delivered", "type": "desktop", "title": title, "message": message}
