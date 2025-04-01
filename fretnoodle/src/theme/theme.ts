import { createTheme, Theme, PaletteMode } from '@mui/material/styles';

// Create theme based on mode (light/dark)
export const createAppTheme = (mode: PaletteMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0ea293' : '#27e1c1',
        light: mode === 'light' ? '#27e1c1' : '#4fffd9',
        dark: mode === 'light' ? '#2f0f5d' : '#0ea293',
      },
      secondary: {
        main: '#f5f3c1',
        light: '#ffffff',
        dark: '#c1c1c1',
      },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
    },
  });
};

// Default theme (for backward compatibility)
const theme = createAppTheme('light');
export default theme;