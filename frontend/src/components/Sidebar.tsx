import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import { Dashboard as DashIcon, AddAlert, Search, ShowChart } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashIcon />, path: '/' },
    { text: 'Create Reminder', icon: <AddAlert />, path: '/create' },
    { text: 'Workflow Explorer', icon: <Search />, path: '/explorer' },
    { text: 'MCP & Agent Monitor', icon: <ShowChart />, path: '/monitor' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#090915',
          borderRight: '1px solid rgba(156, 39, 176, 0.2)',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', gap: 1, py: 2 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #2196f3, #9c27b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ReminderAds
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: active ? 'rgba(156, 39, 176, 0.15)' : 'transparent',
                borderLeft: active ? '4px solid #9c27b0' : '4px solid transparent',
                color: active ? '#ffffff' : '#b0b0c0',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.08)',
                  color: '#ffffff',
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? '#9c27b0' : '#b0b0c0', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: active ? 600 : 500, fontSize: '0.95rem' }}>{item.text}</Typography>} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
