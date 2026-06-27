<!-- Project Overview for ReminderAds -->
# ReminderAds
AI-powered context-based reminder system using Google ADK, Vertex AI, and FastAPI.

## Shared Workflow Context
ReminderAds relies on a single source of truth for workflow state: the **WorkflowContext**.
This context is an immutable Pydantic v2 object containing specialized domains (e.g., Activity, Calendar, Learning). Every agent in the pipeline receives the context, enriches its respective domain, and returns an updated copy. This avoids the fragility of passing scattered variables and ensures deep auditability and replayability of agent execution.

See [docs/architecture.md](docs/architecture.md) for more details.

## MCP Server Tool Registry
The Model Context Protocol (MCP) Server provides a standardized Tool Registry allowing any ADK Agent to discover and invoke tools cleanly (e.g. Browser interactions, Notifications). 

See [docs/api.md](docs/api.md) for more details on the MCP framework.

## Running the Application

### 1. Backend Server (FastAPI)
Install Python dependencies and start the backend:
```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

### 2. Frontend React Dashboard
Install packages and start the dev server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to access the dashboard.
- **Dashboard**: High-level overview of reminders, active agents, and statistics.
- **Create Reminder**: Main demo sandbox. Define title, priority, and category, and run the complete multi-agent execution pipeline.
- **Workflow Explorer**: Audit past workflows, browse chronological execution logs, and inspect the raw `WorkflowContext` JSON payload.
- **MCP & Agent Monitor**: Diagnostics center displaying health, execution counts, and average runtime for ADK Agents and MCP tools.
