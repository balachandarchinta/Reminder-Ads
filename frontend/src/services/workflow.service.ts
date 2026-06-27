import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export interface ReminderRequest {
  title: string;
  description?: string;
  time?: string;
  priority: number;
  category: string;
  user_id: string;
}

export interface ToolExecution {
  tool_name: string;
  arguments: any;
  execution_time_ms: number;
  status: string;
  timestamp: string;
}

export interface AgentExecutionMetadata {
  agent_name: string;
  started_at: string;
  completed_at?: string;
  processing_time_ms?: number;
  status: string;
  tool_calls: ToolExecution[];
  llm_tokens?: number;
  errors: string[];
}

export interface MetadataContext {
  workflow_id: string;
  context_version: string;
  reminder_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  workflow_status: string;
  current_agent: string;
  next_agent?: string;
  execution_history: AgentExecutionMetadata[];
}

export interface ReminderContext {
  title: string;
  description?: string;
  scheduled_time?: string;
  priority: number;
  category: string;
  urgency?: string;
}

export interface ActivityContext {
  website?: string;
  active_tab?: string;
  application?: string;
  browser?: string;
  video_playing?: boolean;
  meeting_detected?: boolean;
  idle?: boolean;
  device_type?: string;
  confidence_score?: number;
}

export interface DecisionContext {
  recommended_action?: string;
  reason?: string;
  delivery_channel?: string;
  deliver_now?: boolean;
  retry_after?: string;
}

export interface WorkflowContext {
  metadata: MetadataContext;
  reminder: ReminderContext;
  activity?: ActivityContext;
  decision?: DecisionContext;
}

export const workflowService = {
  async executeWorkflow(request: ReminderRequest): Promise<WorkflowContext> {
    const response = await axios.post<WorkflowContext>(`${API_BASE}/workflow/execute`, request);
    const workflows = this.getWorkflows();
    workflows.unshift(response.data);
    localStorage.setItem('reminderads_workflows', JSON.stringify(workflows));
    return response.data;
  },

  getWorkflows(): WorkflowContext[] {
    const data = localStorage.getItem('reminderads_workflows');
    return data ? JSON.parse(data) : [];
  },

  clearHistory(): void {
    localStorage.removeItem('reminderads_workflows');
  }
};
