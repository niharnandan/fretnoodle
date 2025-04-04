import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
  Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactsIcon from '@mui/icons-material/Contacts';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../../theme/ThemeContext';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showHowToButton, setShowHowToButton] = useState(false);

  // Check if we're on the fretboard page
  const isFretboardPage = location.pathname === '/fretboard';

  // Effect to handle the animation timing
  useEffect(() => {
    // When navigating to fretboard page, add a small delay before showing the button
    if (isFretboardPage) {
      const timer = setTimeout(() => {
        setShowHowToButton(true);
      }, 400); // Delay the appearance for a more noticeable effect
      
      return () => clearTimeout(timer);
    } else {
      setShowHowToButton(false);
    }
  }, [isFretboardPage]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1100 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuItem onClick={() => handleNavigation('/')}> <HomeIcon sx={{ mr: 1 }} /> Home </MenuItem>
            <MenuItem onClick={() => handleNavigation('/about')}> <InfoIcon sx={{ mr: 1 }} /> About </MenuItem>
            <MenuItem onClick={() => handleNavigation('/contact')}> <ContactsIcon sx={{ mr: 1 }} /> Contact </MenuItem>
            <MenuItem onClick={() => handleNavigation('/fretboard')}> <MusicNoteIcon sx={{ mr: 1 }} /> FretBoard </MenuItem>
            {isFretboardPage && (
              <MenuItem onClick={() => handleNavigation('/howto')}> <HelpOutlineIcon sx={{ mr: 1 }} /> How To Use </MenuItem>
            )}
            <MenuItem>
              {theme.palette.mode === 'dark' ? <Brightness7Icon sx={{ mr: 1 }} /> : <Brightness4Icon sx={{ mr: 1 }} />}
              <FormControlLabel
                control={
                  <Switch
                    checked={theme.palette.mode === 'dark'}
                    onChange={colorMode.toggleColorMode}
                    name="themeToggle"
                    color="primary"
                  />
                }
                label={theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              />
            </MenuItem>
          </Menu>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: 'pointer' }}
              onClick={handleLogoClick}
            >
              FretNoodle
            </Typography>
            <Button color="inherit" variant="outlined" onClick={() => navigate('/fretboard')} sx={{ ml: 2 }}>
              FretBoard
            </Button>
            
            {/* Animated How To button when on the fretboard page */}
            <Fade in={isFretboardPage && showHowToButton} timeout={800}>
              <Box sx={{ display: 'inline-flex', ml: 2 }}>
                {isFretboardPage && (
                  <Button 
                    color="inherit" 
                    variant="outlined" 
                    onClick={() => navigate('/howto')} 
                    startIcon={<HelpOutlineIcon />}
                  >
                    How To
                  </Button>
                )}
              </Box>
            </Fade>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;