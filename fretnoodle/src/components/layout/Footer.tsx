import React from 'react';
import { Box, Container, Typography, Link, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the Item component using styled and Paper
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
            <Item>
              <Typography variant="h6" gutterBottom>
                FretNoodle
              </Typography>
              <Typography variant="body2">
                Your ultimate guitar companion for tuning, visualization, and more.
              </Typography>
            </Item>
            <Item>
              <Typography variant="h6" gutterBottom>
                Links
              </Typography>
              <Typography variant="body2">
                <Link color="inherit" href="/">Home</Link>
              </Typography>
              <Typography variant="body2">
                <Link color="inherit" href="/tuner">Tuner</Link>
              </Typography>
              <Typography variant="body2">
                <Link color="inherit" href="/visualizer">Visualizer</Link>
              </Typography>
            </Item>
            <Item>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2">
                Email: info@fretnoodle.com
              </Typography>
            </Item>
          </Grid>
        <Box mt={3}>
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} FretNoodle. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
