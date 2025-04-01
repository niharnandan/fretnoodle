import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { createAppTheme } from './theme';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Try to get theme from localStorage, default to 'light' if not found
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  // Create the theme using the current mode
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // Toggle between light and dark themes
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Create a memoized context value
  const colorModeContextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorModeContextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;