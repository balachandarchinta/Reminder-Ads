# Decision Agent

The Decision Agent is the final reasoning step of the ReminderAds agent pipeline.

## Responsibilities
- Analyzes metadata, user reminder parameters, and the digital activity context.
- Invokes the MCP Preferences Tool to understand user settings.
- Applies deterministic routing rules to determine if a notification is sent.
- Invokes the MCP Notification Tool to fire alerts (mocks only).
- Enriches the `DecisionContext` in the immutable `WorkflowContext`.
- Transitions the workflow to `DECISION_READY` and sets the next agent to `None`.
