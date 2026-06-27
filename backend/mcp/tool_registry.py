"""
MCP Tool Registry for ReminderAds.
"""
import logging
import time
from typing import Callable, Dict, Any

logger = logging.getLogger(__name__)

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Callable] = {}

    def register(self, name: str, func: Callable):
        """Registers a tool with the registry."""
        self._tools[name] = func
        logger.info(f"Tool registered: {name}")

    def invoke(self, name: str, **kwargs) -> Any:
        """
        Invokes a registered tool, logging execution time, arguments, results, and errors.
        """
        if name not in self._tools:
            logger.error(f"Tool not found: {name}")
            raise ValueError(f"Tool '{name}' is not registered.")

        func = self._tools[name]
        start_time = time.time()
        logger.info(f"Tool Invoked: {name}", extra={"Arguments": kwargs})
        
        try:
            result = func(**kwargs)
            exec_time_ms = (time.time() - start_time) * 1000
            logger.info(f"Tool Completed: {name}", extra={
                "Execution Time": f"{exec_time_ms:.2f}ms",
                "Result": result
            })
            return result
        except Exception as e:
            exec_time_ms = (time.time() - start_time) * 1000
            logger.error(f"Tool Error: {name}", extra={
                "Execution Time": f"{exec_time_ms:.2f}ms",
                "Errors": str(e)
            })
            raise

# Global registry instance
registry = ToolRegistry()

def mcp_tool(name: str):
    """Decorator to register a function as an MCP tool."""
    def decorator(func: Callable):
        registry.register(name, func)
        return func
    return decorator
