import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For the menu icon
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const NavBar: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the root page when clicked
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', cursor: 'pointer' }}
            onClick={handleLogoClick} // Handle click to navigate to the root
          >
            FretNoodle
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/about')}>
            About
          </Button>
          <Button color="inherit" onClick={() => navigate('/contact')}>
            Contact
          </Button>
          <Button color="inherit" onClick={() => navigate('/fretboard')}>
            FretBoard
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
