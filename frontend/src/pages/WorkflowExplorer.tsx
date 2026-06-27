import { useState, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Box, Collapse, IconButton } from '@mui/material';
import { Search as SearchIcon, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { workflowService } from '../services/workflow.service';
import { logService } from '../services/log.service';

export default function WorkflowExplorer() {
  const [search, setSearch] = useState('');
  const [openWorkflowId, setOpenWorkflowId] = useState<string | null>(null);

  const workflows = workflowService.getWorkflows();
  const logs = logService.getLogs();

  const filteredWorkflows = workflows.filter(w => 
    w.reminder.title.toLowerCase().includes(search.toLowerCase()) ||
    w.metadata.workflow_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setOpenWorkflowId(openWorkflowId === id ? null : id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Workflow Explorer & Log Audits
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
                          <TableRow hover>
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
                            <TableCell>{new Date(w.metadata.created_at).toLocaleTimeString()}</TableCell>
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

        {/* Right: Chronological Log Table */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                Live Audit Logs
              </Typography>
              <Box sx={{ maxHeight: 500, overflowY: 'auto', mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {logs.map((log, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.01)', borderLeft: '3px solid', borderColor: log.status === 'DECISION' ? '#e040fb' : '#2196f3', borderRadius: '0 8px 8px 0', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <Box sx={{ display: 'flex', justifycontent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {log.agent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {log.message}
                    </Typography>
                    {log.duration !== undefined && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Duration: {log.duration.toFixed(1)}ms
                      </Typography>
                    )}
                  </Box>
                ))}
                {logs.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                    No audit logs available yet.
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
