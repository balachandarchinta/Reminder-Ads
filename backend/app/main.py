"""
FastAPI application entry point for ReminderAds.
"""
import sys
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

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.reminders import router as reminders_router
from backend.app.api.activity import router as activity_router
from backend.app.api.decision import router as decision_router
from backend.app.api.workflow import router as workflow_router


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI(title="ReminderAds API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reminders_router, prefix="/api/v1/reminders", tags=["Reminders"])
app.include_router(activity_router, prefix="/api/v1/activity", tags=["Activity"])
app.include_router(decision_router, prefix="/api/v1/decision", tags=["Decision"])
app.include_router(workflow_router, prefix="/api/v1/workflow", tags=["Workflow"])

