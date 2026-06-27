import { parseUtcDate } from '../services/workflow.service';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Chip } from '@mui/material';
import { Refresh, ShowChart, ToggleOn } from '@mui/icons-material';
import { agentService } from '../services/agent.service';
import { toolService } from '../services/tool.service';

export default function Monitor() {
  const [agents, setAgents] = useState(agentService.getAgentStats());
  const [tools, setTools] = useState(toolService.getToolStats());

  const handleRefresh = () => {
    setAgents(agentService.getAgentStats());
    setTools(toolService.getToolStats());
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          MCP & Agent Diagnostics
        </Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh}>
          Refresh Metrics
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Agent Monitor */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChart />
                ADK Agent Performance
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 3, background: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Agent Name</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Execution Count</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Average Runtime</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Last Execution</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Health</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents.map((a) => (
                      <TableRow key={a.name} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{a.displayName}</TableCell>
                        <TableCell>
                          <Chip label={a.status} color="success" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{a.executionCount}</TableCell>
                        <TableCell>{a.avgRuntimeMs.toFixed(1)}ms</TableCell>
                        <TableCell>{a.lastExecuted ? parseUtcDate(a.lastExecuted).toLocaleTimeString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ToggleOn sx={{ color: '#4caf50' }} />
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>Healthy</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* MCP Tool Monitor */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Refresh />
                MCP Tool Registry Monitor
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 3, background: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Tool Name</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Invocations</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Avg Exec Time</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Last Invocation</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tools.map((t) => (
                      <TableRow key={t.name} hover>
                        <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>{t.name}</TableCell>
                        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.description}
                        </TableCell>
                        <TableCell>{t.invocationCount}</TableCell>
                        <TableCell>{t.avgTimeMs.toFixed(1)}ms</TableCell>
                        <TableCell>{t.lastInvocation ? parseUtcDate(t.lastInvocation).toLocaleTimeString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label={t.status} color="primary" size="small" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
