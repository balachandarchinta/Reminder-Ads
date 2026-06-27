import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Box, Avatar } from '@mui/material';
import { AccessTime, PlayArrow, CheckCircle, Memory, Security, ToggleOn } from '@mui/icons-material';
import { workflowService } from '../services/workflow.service';
import { agentService } from '../services/agent.service';
import { toolService } from '../services/tool.service';

export default function Dashboard() {
  const workflows = workflowService.getWorkflows();
  const agentStats = agentService.getAgentStats();
  const toolStats = toolService.getToolStats();

  const totalReminders = workflows.length;
  const completed = workflows.filter(w => w.decision?.deliver_now).length;
  const delayed = workflows.filter(w => w.decision && !w.decision.deliver_now).length;
  const activeMcpTools = toolStats.length;
  const totalAgentExecutions = agentStats.reduce((acc, current) => acc + current.executionCount, 0);

  const kpis = [
    { title: 'Total Reminders', value: totalReminders, icon: <AccessTime />, color: '#9c27b0' },
    { title: 'Immediate Deliveries', value: completed, icon: <CheckCircle />, color: '#4caf50' },
    { title: 'Delayed Reminders', value: delayed, icon: <PlayArrow />, color: '#ff9800' },
    { title: 'Registered MCP Tools', value: activeMcpTools, icon: <Memory />, color: '#2196f3' },
    { title: 'Agent Executions', value: totalAgentExecutions, icon: <Security />, color: '#e91e63' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Contextual Orchestration Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={idx}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2.5, flexGrow: 1 }}>
                <Avatar sx={{ bgcolor: kpi.color, width: 44, height: 44, mb: 1.5 }}>
                  {kpi.icon}
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', fontWeight: 500, minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Agent Health Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ADK Agent Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
                {agentStats.map((agent) => (
                  <Box key={agent.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {agent.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average execution time: {agent.avgRuntimeMs.toFixed(1)}ms
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ToggleOn sx={{ color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        Active
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Workflows */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                Recent Workflow Executions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                {workflows.slice(0, 4).map((w) => (
                  <Box key={w.metadata.workflow_id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {w.reminder.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(w.metadata.created_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color={w.decision?.deliver_now ? '#4caf50' : '#ff9800'} sx={{ fontWeight: 600 }}>
                        {w.decision?.deliver_now ? 'Delivered Immediately' : 'Delayed'}
                      </Typography>
                      <Typography variant="caption" sx={{ p: '2px 8px', bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', borderRadius: 1.5 }}>
                        {w.metadata.workflow_status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {workflows.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No workflows executed yet. Start by creating a reminder.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
