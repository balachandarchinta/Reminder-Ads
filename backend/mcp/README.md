# MCP Server for ReminderAds

The MCP (Model Context Protocol) Server provides a standardized, discoverable tool registry for all ADK agents in ReminderAds.

## Tool Registry
The `ToolRegistry` acts as a central hub for tools. It handles:
- **Dynamic Registration**: Tools are easily added using the `@mcp_tool("name")` decorator.
- **Auditing & Logging**: Every tool invocation automatically logs execution time, arguments, results, and errors.
- **Routing**: Agents invoke tools via `server.call_tool(tool_name, **kwargs)` without needing raw implementation details.

## Available Tools (Sprint 4)
- **Reminder Tool**: `create_reminder`, `update_reminder`, `delete_reminder`, `get_reminder`
- **Browser Context Tool**: `get_current_activity`, `get_active_tab`, `get_browser_state`
- **Notification Tool**: `send_banner`, `send_overlay`, `send_desktop_notification`
- **Preference Tool**: `get_preferences`, `update_preferences`

*Note: In Sprint 4, these tools are currently implemented as mock interfaces for testing agent orchestration.*
