"""
Test runner script to execute tests without requiring external testing framework.
"""
import sys
import os

# Ensure the root of the project is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Mock google_adk
from unittest.mock import MagicMock

class StubModelConfig:
    def __init__(self, *args, **kwargs):
        pass

class StubAgent:
    def __init__(self, *args, **kwargs):
        self.name = kwargs.get("name", "agent")
        self.instructions = kwargs.get("instructions", "")
        self.registered_tools = []
    def register_tool(self, tool):
        self.registered_tools.append(tool)

m_google_adk = MagicMock()
m_google_adk.Agent = StubAgent
m_google_adk.ModelConfig = StubModelConfig
sys.modules['google_adk'] = m_google_adk

from backend.tests.agents.test_activity_agent import test_activity_agent_enrichment
from backend.tests.agents.test_reminder_manager import test_reminder_manager_orchestration
from backend.tests.agents.test_decision_agent import test_decision_agent_evaluation
from backend.tests.mcp.test_tools import (
    test_mcp_tool_discovery,
    test_mcp_tool_invocation_success,
    test_mcp_tool_invocation_with_args,
    test_mcp_tool_invocation_not_found
)

if __name__ == "__main__":
    print("Running unit tests...")
    tests = [
        ("test_activity_agent_enrichment", test_activity_agent_enrichment),
        ("test_reminder_manager_orchestration", test_reminder_manager_orchestration),
        ("test_decision_agent_evaluation", test_decision_agent_evaluation),
        ("test_mcp_tool_discovery", test_mcp_tool_discovery),
        ("test_mcp_tool_invocation_success", test_mcp_tool_invocation_success),
        ("test_mcp_tool_invocation_with_args", test_mcp_tool_invocation_with_args),
        ("test_mcp_tool_invocation_not_found", test_mcp_tool_invocation_not_found),
    ]

    failed = 0
    for name, test in tests:
        try:
            test()
            print(f"PASS: {name}")
        except Exception as e:
            print(f"FAIL: {name} - {e}")
            failed += 1

    if failed:
        print(f"\nSome tests failed ({failed}/{len(tests)}).")
        sys.exit(1)
    else:
        print("\nAll tests passed successfully!")
        sys.exit(0)
