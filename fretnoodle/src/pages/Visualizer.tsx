import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const Visualizer: React.FC = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Sound Visualizer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph align="center">
          See your guitar's sound come to life with dynamic visualizations
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="body1" paragraph>
            The sound visualizer feature is coming soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Visualizer;