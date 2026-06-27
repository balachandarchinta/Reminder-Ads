import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
    },
    secondary: {
      main: '#2196f3', // Blue
    },
    background: {
      default: '#0a0a16',
      paper: '#121226',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0c0',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #121226 0%, #1a1a36 100%)',
          border: '1px solid rgba(156, 39, 176, 0.15)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(33, 150, 243, 0.4)',
            boxShadow: '0 8px 32px 0 rgba(33, 150, 243, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
  },
});
