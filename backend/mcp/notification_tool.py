"""
Notification Tool implementation for MCP Server.
"""
from typing import Dict, Any
from .tool_registry import mcp_tool

@mcp_tool("send_banner")
def send_banner(message: str) -> Dict[str, Any]:
    """Mock browser notification: Banner alert."""
    return {"status": "delivered", "type": "banner", "message": message}

@mcp_tool("send_overlay")
def send_overlay(message: str) -> Dict[str, Any]:
    """Mock browser notification: Full-screen overlay alert."""
    return {"status": "delivered", "type": "overlay", "message": message}

@mcp_tool("send_desktop_notification")
def send_desktop_notification(title: str, message: str) -> Dict[str, Any]:
    """Mock OS desktop notification."""
    return {"status": "delivered", "type": "desktop", "title": title, "message": message}
