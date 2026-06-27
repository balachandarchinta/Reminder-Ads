import { workflowService } from './workflow.service';

export interface LogRow {
  timestamp: string;
  workflowId: string;
  agent: string;
  tool?: string;
  message: string;
  duration?: number;
  status: string;
}

export const logService = {
  getLogs(): LogRow[] {
    const workflows = workflowService.getWorkflows();
    const logs: LogRow[] = [];

    workflows.forEach(w => {
      const wId = w.metadata.workflow_id;
      
      // Workflow started
      logs.push({
        timestamp: w.metadata.created_at,
        workflowId: wId,
        agent: 'Orchestrator',
        message: `Workflow started for reminder: "${w.reminder.title}"`,
        status: 'INFO',
      });

      w.metadata.execution_history.forEach(h => {
        // Agent started
        logs.push({
          timestamp: h.started_at,
          workflowId: wId,
          agent: h.agent_name,
          message: `Agent ${h.agent_name} invoked.`,
          status: 'INFO',
        });

        // Tool calls
        h.tool_calls.forEach(t => {
          logs.push({
            timestamp: t.timestamp,
            workflowId: wId,
            agent: h.agent_name,
            tool: t.tool_name,
            message: `Invoked MCP tool "${t.tool_name}" with args: ${JSON.stringify(t.arguments)}`,
            duration: t.execution_time_ms,
            status: t.status,
          });
        });

        // Agent completed
        if (h.completed_at) {
          logs.push({
            timestamp: h.completed_at,
            workflowId: wId,
            agent: h.agent_name,
            message: `Agent ${h.agent_name} completed processing.`,
            duration: h.processing_time_ms,
            status: h.status,
          });
        }
      });

      // Final decision log
      if (w.decision) {
        logs.push({
          timestamp: w.metadata.updated_at,
          workflowId: wId,
          agent: 'decision_agent',
          message: `Decision: action=${w.decision.recommended_action}, deliver_now=${w.decision.deliver_now}. Reason: ${w.decision.reason}`,
          status: 'DECISION',
        });
      }
    });

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
