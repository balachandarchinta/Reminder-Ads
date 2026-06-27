"""
Basic unit tests for MCP Server and Tools.
"""
import pytest
from backend.mcp.server import server

def test_mcp_tool_discovery():
    tools = server.list_tools()
    assert "create_reminder" in tools
    assert "get_current_activity" in tools
    assert "send_banner" in tools

def test_mcp_tool_invocation_success():
    result = server.call_tool("get_current_activity")
    assert result["activity"] == "reading"

def test_mcp_tool_invocation_with_args():
    result = server.call_tool("create_reminder", title="Test")
    assert result["status"] == "success"
    assert result["title"] == "Test"

def test_mcp_tool_invocation_not_found():
    with pytest.raises(ValueError):
        server.call_tool("non_existent_tool")
