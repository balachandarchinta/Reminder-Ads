import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, TextField, Button, Box, MenuItem, CircularProgress, Stepper, Step, StepLabel, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';
import { workflowService } from '../services/workflow.service';

export default function CreateReminder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    priority: 1,
    category: 'general',
    user_id: 'hackathon_demo_user',
  });

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    { label: 'Reminder Manager Agent', desc: 'Validating input and initializing context' },
    { label: 'Activity Agent', desc: 'Querying browser MCP tools for user digital state' },
    { label: 'Decision Agent', desc: 'Applying routing rules and executing notification tools' }
  ];

  // Simulate loading steps during backend call
  useEffect(() => {
    let timer1: number;
    let timer2: number;
    if (loading) {
      setActiveStep(0);
      timer1 = window.setTimeout(() => {
        setActiveStep(1);
      }, 1000);
      timer2 = window.setTimeout(() => {
        setActiveStep(2);
      }, 2000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      let isoTime: string | undefined = undefined;
      if (formData.time) {
        const d = new Date(formData.time);
        if (isNaN(d.getTime())) {
          throw new Error('Please select a valid date and time.');
        }
        isoTime = d.toISOString();
      }

      const res = await workflowService.executeWorkflow({
        ...formData,
        time: isoTime
      });
      // Redirect to explorer with highlight state
      setTimeout(() => {
        navigate('/explorer', { state: { highlightWorkflowId: res.metadata.workflow_id } });
      }, 500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to execute agent workflow. Check if backend is running on http://localhost:8001. Details: ${err.message || err}`);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Create Contextual Reminder
      </Typography>

      <Grid container spacing={4}>
        {/* Form Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                New Reminder Details
              </Typography>
              
              {errorMsg && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }} onClose={() => setErrorMsg(null)}>
                  {errorMsg}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Title"
                  required
                  fullWidth
                  disabled={loading}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <TextField
                  label="Description (Optional)"
                  fullWidth
                  multiline
                  rows={3}
                  disabled={loading}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <TextField
                  label="Fixed Reminder Time (Optional)"
                  type="datetime-local"
                  fullWidth
                  disabled={loading}
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                <TextField
                  select
                  label="Priority"
                  fullWidth
                  disabled={loading}
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
                  disabled={loading}
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
                  {loading ? 'Running Agents...' : 'Execute Agent Workflow'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Loading Stepper Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          {loading ? (
            <Card sx={{ height: '100%', py: 6, px: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <CircularProgress size={50} color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6">Orchestrating Multi-Agent Pipeline</Typography>
                <Typography variant="body2" color="text.secondary">
                  Updating shared, immutable WorkflowContext
                </Typography>
              </Box>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography sx={{ fontWeight: activeStep === index ? 700 : 500 }}>
                        {step.label} {activeStep === index && '(Running...)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.desc}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Card>
          ) : (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, borderStyle: 'dashed' }}>
              <Typography variant="h6" color="text.secondary">
                Awaiting Workflow Trigger
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Fill out the form and submit to witness the live agent pipeline execution.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
