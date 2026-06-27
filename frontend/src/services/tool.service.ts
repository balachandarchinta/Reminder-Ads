import { workflowService, parseUtcDate } from './workflow.service';

export interface ToolStat {
  name: string;
  description: string;
  invocationCount: number;
  avgTimeMs: number;
  lastInvocation?: string;
  status: string;
}

export const toolService = {
  getToolStats(): ToolStat[] {
    const workflows = workflowService.getWorkflows();
    const statsMap: Record<string, { count: number; totalTime: number; lastInv?: string }> = {
      get_current_activity: { count: 0, totalTime: 0 },
      get_active_tab: { count: 0, totalTime: 0 },
      get_browser_state: { count: 0, totalTime: 0 },
      get_preferences: { count: 0, totalTime: 0 },
      send_banner: { count: 0, totalTime: 0 },
      send_overlay: { count: 0, totalTime: 0 },
      send_desktop_notification: { count: 0, totalTime: 0 },
    };

    workflows.forEach(w => {
      w.metadata.execution_history.forEach(h => {
        h.tool_calls.forEach(t => {
          if (statsMap[t.tool_name]) {
            statsMap[t.tool_name].count += 1;
            statsMap[t.tool_name].totalTime += t.execution_time_ms;
            if (!statsMap[t.tool_name].lastInv || parseUtcDate(t.timestamp) > parseUtcDate(statsMap[t.tool_name].lastInv!)) {
              statsMap[t.tool_name].lastInv = t.timestamp;
            }
          }
        });
      });
    });

    return [
      {
        name: 'get_current_activity',
        description: 'Retrieves user idle status and primary desktop application context.',
        invocationCount: statsMap.get_current_activity.count,
        avgTimeMs: statsMap.get_current_activity.count ? statsMap.get_current_activity.totalTime / statsMap.get_current_activity.count : 0,
        lastInvocation: statsMap.get_current_activity.lastInv,
        status: 'Online',
      },
      {
        name: 'get_active_tab',
        description: 'Exposes website title and url of the active tab in browser.',
        invocationCount: statsMap.get_active_tab.count,
        avgTimeMs: statsMap.get_active_tab.count ? statsMap.get_active_tab.totalTime / statsMap.get_active_tab.count : 0,
        lastInvocation: statsMap.get_active_tab.lastInv,
        status: 'Online',
      },
      {
        name: 'get_browser_state',
        description: 'Retrieves video playback indicators and browser hardware settings.',
        invocationCount: statsMap.get_browser_state.count,
        avgTimeMs: statsMap.get_browser_state.count ? statsMap.get_browser_state.totalTime / statsMap.get_browser_state.count : 0,
        lastInvocation: statsMap.get_browser_state.lastInv,
        status: 'Online',
      },
      {
        name: 'get_preferences',
        description: 'Loads contextual quiet hours and rules set by the user.',
        invocationCount: statsMap.get_preferences.count,
        avgTimeMs: statsMap.get_preferences.count ? statsMap.get_preferences.totalTime / statsMap.get_preferences.count : 0,
        lastInvocation: statsMap.get_preferences.lastInv,
        status: 'Online',
      },
      {
        name: 'send_banner',
        description: 'Draws a non-intrusive warning notification on active tabs.',
        invocationCount: statsMap.send_banner.count,
        avgTimeMs: statsMap.send_banner.count ? statsMap.send_banner.totalTime / statsMap.send_banner.count : 0,
        lastInvocation: statsMap.send_banner.lastInv,
        status: 'Online',
      },
      {
        name: 'send_overlay',
        description: 'Places a high-urgency overlay banner on active browser screens.',
        invocationCount: statsMap.send_overlay.count,
        avgTimeMs: statsMap.send_overlay.count ? statsMap.send_overlay.totalTime / statsMap.send_overlay.count : 0,
        lastInvocation: statsMap.send_overlay.lastInv,
        status: 'Online',
      },
      {
        name: 'send_desktop_notification',
        description: 'Pops up standard OS-level notifications when browser is minimized.',
        invocationCount: statsMap.send_desktop_notification.count,
        avgTimeMs: statsMap.send_desktop_notification.count ? statsMap.send_desktop_notification.totalTime / statsMap.send_desktop_notification.count : 0,
        lastInvocation: statsMap.send_desktop_notification.lastInv,
        status: 'Online',
      },
    ];
  }
};
