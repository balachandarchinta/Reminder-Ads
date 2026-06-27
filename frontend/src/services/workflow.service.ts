import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8001/api/v1';

export interface ReminderRequest {
  title: string;
  description?: string;
  time?: string;
  priority: number;
  category: string;
  user_id: string;
}

export interface WorkflowContext {
  metadata: {
    workflow_id: string;
    context_version: string;
    created_at: string;
    updated_at: string;
    workflow_status: string;
    current_agent: string;
    next_agent: string | null;
    execution_history: Array<{
      agent_name: string;
      started_at: string;
      completed_at: string;
      processing_time_ms: number | null;
      status: string;
      tool_calls: Array<{
        tool_name: string;
        arguments: any;
        execution_time_ms: number;
        status: string;
        timestamp: string;
      }>;
    }>;
  };
  reminder: {
    title: string;
    description?: string;
    scheduled_time: string | null;
    priority: number;
    category: string;
  };
  activity?: {
    website?: string;
    active_tab?: string;
    video_playing?: boolean;
    idle?: boolean;
  };
  decision?: {
    deliver_now: boolean;
    recommended_action: string;
    reason: string;
    delivery_channel?: string;
  };
}

class WorkflowService {
  executeWorkflow(data: ReminderRequest): Promise<WorkflowContext> {
    return axios.post(`${API_BASE}/workflow/execute`, data)
      .then(res => {
        const workflows = this.getWorkflows();
        workflows.unshift(res.data);
        localStorage.setItem('reminderads_workflows', JSON.stringify(workflows));
        return res.data;
      });
  }

  getWorkflows(): WorkflowContext[] {
    const val = localStorage.getItem('reminderads_workflows');
    return val ? JSON.parse(val) : [];
  }
}

export const workflowService = new WorkflowService();

export function parseUtcDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date();
  const hasTimezone = dateStr.includes('Z') || /[+-]\d{2}:\d{2}$/.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}
