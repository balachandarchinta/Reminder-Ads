import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, TextField, Button, Box, MenuItem, CircularProgress, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { Send, CheckCircleOutlined } from '@mui/icons-material';
import { workflowService } from '../services/workflow.service';
import type { WorkflowContext } from '../services/workflow.service';

export default function CreateReminder() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    priority: 1,
    category: 'general',
    user_id: 'hackathon_demo_user',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowContext | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await workflowService.executeWorkflow(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to FastAPI backend. Ensure it is running locally on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Contextual Reminder Sandbox
      </Typography>

      <Grid container spacing={4}>
        {/* Form Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                New Reminder Request
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Title"
                  required
                  fullWidth
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <TextField
                  label="Description (Optional)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <TextField
                  select
                  label="Priority"
                  fullWidth
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                >
                  <MenuItem value={1}>Low Priority</MenuItem>
                  <MenuItem value={2}>High Priority</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="work">Work / Task</MenuItem>
                  <MenuItem value="entertainment">Entertainment / Video</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </TextField>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  sx={{ py: 1.5, background: 'linear-gradient(45deg, #9c27b0, #2196f3)' }}
                >
                  Execute Agent Workflow
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Execution & Decision Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          {loading && (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={60} color="primary" sx={{ mb: 3 }} />
              <Typography variant="h6">Orchestrating AI Agents...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Invoking Browser Tool & Preferences via MCP Tool Registry
              </Typography>
            </Card>
          )}

          {!loading && !result && (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, borderStyle: 'dashed' }}>
              <Typography variant="h6" color="text.secondary">
                Awaiting Workflow Trigger
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Fill out the form and submit to witness the live agent routing pipeline.
              </Typography>
            </Card>
          )}

          {!loading && result && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Agent Timeline */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    AI Execution Pipeline
                  </Typography>
                  <Stepper orientation="vertical" sx={{ mt: 3 }}>
                    <Step active completed>
                      <StepLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reminder Manager Agent</Typography>
                          <Chip label="SUCCESS" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Initialized WorkflowContext. Routed next step to Activity Agent.
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Activity Agent</Typography>
                          <Chip label="SUCCESS" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Invoked MCP Browser tools: website = "{result.activity?.website}", idle = {String(result.activity?.idle)}.
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Decision Agent</Typography>
                          <Chip label="SUCCESS" color="success" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Invoked preference tools. Decided on delivery action and triggered alert.
                        </Typography>
                      </StepLabel>
                    </Step>
                  </Stepper>
                </CardContent>
              </Card>

              {/* Decision Card */}
              <Card sx={{ background: 'linear-gradient(135deg, #1a1a3c 0%, #2b1b54 100%)', border: '2px solid rgba(156, 39, 176, 0.4)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e040fb' }}>
                    <CheckCircleOutlined />
                    Final Reminder Decision
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Action</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'uppercase', color: result.decision?.deliver_now ? '#4caf50' : '#ff9800' }}>
                        {result.decision?.recommended_action}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Deliver Now</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {String(result.decision?.deliver_now)}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">Reasoning Explanation</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)', mt: 0.5 }}>
                        {result.decision?.reason}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
