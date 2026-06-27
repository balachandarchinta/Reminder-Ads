import { useState, Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Box, Collapse, IconButton, Stepper, Step, StepLabel } from '@mui/material';
import { Search as SearchIcon, KeyboardArrowDown, KeyboardArrowUp, CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';
import { workflowService, parseUtcDate } from '../services/workflow.service';
import { logService } from '../services/log.service';

export default function WorkflowExplorer() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [openWorkflowId, setOpenWorkflowId] = useState<string | null>(null);

  const workflows = workflowService.getWorkflows();
  const logs = logService.getLogs();

  // Highlight/auto-expand workflow if redirected from Sandbox
  useEffect(() => {
    if (location.state && (location.state as any).highlightWorkflowId) {
      setOpenWorkflowId((location.state as any).highlightWorkflowId);
    }
  }, [location.state]);

  const filteredWorkflows = workflows.filter(w => 
    w.reminder.title.toLowerCase().includes(search.toLowerCase()) ||
    w.metadata.workflow_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setOpenWorkflowId(openWorkflowId === id ? null : id);
  };

  const selectedWorkflow = workflows.find(w => w.metadata.workflow_id === openWorkflowId);
  const selectedLogs = logs.filter(l => l.workflowId === openWorkflowId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Workflow Explorer & Audits
      </Typography>

      <TextField
        fullWidth
        label="Search workflows by Title or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }
        }}
      />

      <Grid container spacing={4}>
        {/* Left: Workflow List */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Workflow Execution History
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2, background: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Reminder Title</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Decision</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkflows.map((w) => {
                      const isOpen = openWorkflowId === w.metadata.workflow_id;
                      return (
                        <Fragment key={w.metadata.workflow_id}>
                          <TableRow hover selected={isOpen}>
                            <TableCell>
                              <IconButton size="small" onClick={() => toggleRow(w.metadata.workflow_id)}>
                                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{w.reminder.title}</TableCell>
                            <TableCell sx={{ color: w.decision?.deliver_now ? '#4caf50' : '#ff9800', fontWeight: 600 }}>
                              {w.decision?.recommended_action || 'Pending'}
                            </TableCell>
                            <TableCell>{w.metadata.workflow_status}</TableCell>
                            <TableCell>{parseUtcDate(w.metadata.created_at).toLocaleTimeString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3, border: '1px solid rgba(156, 39, 176, 0.2)' }}>
                                  <Typography variant="subtitle1" gutterBottom color="secondary" sx={{ fontWeight: 600 }}>
                                    Immutable WorkflowContext JSON
                                  </Typography>
                                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowX: 'auto', background: '#070710', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {JSON.stringify(w, null, 2)}
                                  </pre>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                    {filteredWorkflows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No matching workflows found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Detailed Log & Pipeline Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          {selectedWorkflow ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Decision Card */}
              <Card sx={{ background: 'linear-gradient(135deg, #1a1a3c 0%, #2b1b54 100%)', border: '2px solid rgba(156, 39, 176, 0.4)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e040fb' }}>
                    <CheckCircleOutlined />
                    Reminder Decision Summary
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Recommended Action</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'uppercase', color: selectedWorkflow.decision?.deliver_now ? '#4caf50' : '#ff9800' }}>
                        {selectedWorkflow.decision?.recommended_action}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Deliver Now</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {String(selectedWorkflow.decision?.deliver_now)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">Reasoning</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', mt: 0.5 }}>
                        {selectedWorkflow.decision?.reason}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Execution Pipeline */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Agent Pipeline Runtime Details
                  </Typography>
                  <Stepper orientation="vertical" sx={{ mt: 3 }}>
                    {selectedWorkflow.metadata.execution_history.map((h, i) => (
                      <Step key={i} active completed>
                        <StepLabel>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{h.agent_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(h.processing_time_ms || 0).toFixed(1)}ms
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            MCP Tools Used: {h.tool_calls.map(t => t.tool_name).join(', ') || 'None'}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    Chrono Logs for Workflow
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                    {selectedLogs.map((log, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.01)', borderLeft: '3px solid', borderColor: log.status === 'DECISION' ? '#e040fb' : '#2196f3', borderRadius: '0 8px 8px 0', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {log.agent}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {parseUtcDate(log.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {log.message}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, borderStyle: 'dashed' }}>
              <ErrorOutlined color="action" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" color="text.secondary">
                No Workflow Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expand a workflow in the history grid to inspect logs and timeline metrics.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
