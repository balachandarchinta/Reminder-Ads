import { workflowService } from './workflow.service';

export interface AgentStat {
  name: string;
  displayName: string;
  executionCount: number;
  avgRuntimeMs: number;
  health: 'healthy' | 'warning' | 'critical';
  lastExecuted?: string;
  status: string;
}

export const agentService = {
  getAgentStats(): AgentStat[] {
    const workflows = workflowService.getWorkflows();
    const statsMap: Record<string, { count: number; totalTime: number; lastExec?: string }> = {
      reminder_manager: { count: 0, totalTime: 0 },
      activity_agent: { count: 0, totalTime: 0 },
      decision_agent: { count: 0, totalTime: 0 },
    };

    workflows.forEach(w => {
      w.metadata.execution_history.forEach(h => {
        if (statsMap[h.agent_name]) {
          statsMap[h.agent_name].count += 1;
          statsMap[h.agent_name].totalTime += h.processing_time_ms || 0;
          if (!statsMap[h.agent_name].lastExec || new Date(h.started_at) > new Date(statsMap[h.agent_name].lastExec!)) {
            statsMap[h.agent_name].lastExec = h.started_at;
          }
        }
      });
    });

    return [
      {
        name: 'reminder_manager',
        displayName: 'Reminder Manager Agent',
        executionCount: statsMap.reminder_manager.count,
        avgRuntimeMs: statsMap.reminder_manager.count ? statsMap.reminder_manager.totalTime / statsMap.reminder_manager.count : 0,
        health: 'healthy',
        status: 'Idle',
        lastExecuted: statsMap.reminder_manager.lastExec,
      },
      {
        name: 'activity_agent',
        displayName: 'Activity Agent',
        executionCount: statsMap.activity_agent.count,
        avgRuntimeMs: statsMap.activity_agent.count ? statsMap.activity_agent.totalTime / statsMap.activity_agent.count : 0,
        health: 'healthy',
        status: 'Idle',
        lastExecuted: statsMap.activity_agent.lastExec,
      },
      {
        name: 'decision_agent',
        displayName: 'Decision Agent',
        executionCount: statsMap.decision_agent.count,
        avgRuntimeMs: statsMap.decision_agent.count ? statsMap.decision_agent.totalTime / statsMap.decision_agent.count : 0,
        health: 'healthy',
        status: 'Idle',
        lastExecuted: statsMap.decision_agent.lastExec,
      },
    ];
  }
};
