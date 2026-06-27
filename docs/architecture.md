# ReminderAds Architecture

ReminderAds leverages a multi-agent contextual execution architecture built on the Google Agent Development Kit (ADK), Vertex AI (Gemini), FastAPI, and React.

## End-to-End Execution Flow

```mermaid
sequenceDiagram
    participant FE as Frontend Dashboard
    participant API as FastAPI Router
    participant RM as Reminder Manager
    participant AA as Activity Agent
    participant DA as Decision Agent
    participant MCP as MCP Registry

    FE->>API: POST /api/v1/workflow/execute (ReminderRequest)
    API->>RM: 1. Initialize context
    Note over RM: Build WorkflowContext
    RM-->>API: return WorkflowContext (VALIDATED)
    API->>AA: 2. Query browser state
    AA->>MCP: call get_current_activity, get_active_tab
    MCP-->>AA: return browser state
    AA-->>API: return WorkflowContext (ACTIVITY_ANALYZED)
    API->>DA: 3. Make delivery decision
    DA->>MCP: call get_preferences
    MCP-->>DA: return preferences
    Note over DA: Evaluate Decision Rules
    Note over DA: If deliver_now, send notification
    DA->>MCP: call send_banner / send_overlay
    MCP-->>DA: return success status
    DA-->>API: return WorkflowContext (DECISION_READY)
    API-->>FE: Return final WorkflowContext
```

## Backend Orchestration
The FastAPI backend serves as the orchestration endpoint (`POST /api/v1/workflow/execute`). It feeds the user's `ReminderRequest` into the sequential pipeline:
1. **Reminder Manager**: Instantiates the unified, immutable `WorkflowContext`.
2. **Activity Agent**: Queries browser tools via MCP to evaluate digital state.
3. **Decision Agent**: Pulls preferences, evaluates rules, fires notifications, and populates final decisions.

## Frontend Dashboard
The React dashboard serves as the main demo interface. 
- **API Services**: Uses Axios to interact with the orchestrator.
- **State Audits**: Captures the returned context, parses its execution history and tool metadata into chronological logs, and persists records in `localStorage` for dashboard KPIs and monitor views.
