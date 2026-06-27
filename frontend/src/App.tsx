import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateReminder from './pages/CreateReminder';
import WorkflowExplorer from './pages/WorkflowExplorer';
import Monitor from './pages/Monitor';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 4, ml: 0, minWidth: 0 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateReminder />} />
                <Route path="/explorer" element={<WorkflowExplorer />} />
                <Route path="/monitor" element={<Monitor />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
