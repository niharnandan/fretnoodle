import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          About FretNoodle
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={4}>
            <Grid>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                FretNoodle was created with the mission to help guitarists of all 
                levels perfect their sound through modern digital tools. We combine 
                advanced audio processing technology with user-friendly interfaces to 
                create the ultimate guitar companion app.
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                Features
              </Typography>
              <Typography variant="body1" paragraph>
                • Precise guitar tuning with visual feedback<br />
                • Sound visualization for audio understanding<br />
                • Chord discovery and learning tools<br />
                • And more coming soon...
              </Typography>
            </Grid>
            
            <Grid>
              <Typography variant="h5" gutterBottom>
                Technology
              </Typography>
              <Typography variant="body1" paragraph>
                FretNoodle is built using modern web technologies including React, 
                TypeScript, Material UI, and the p5.js creative coding library. 
                We leverage Web Audio API for precise audio analysis and processing.
              </Typography>
              
              <Typography variant="h5" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body1">
                Have questions or suggestions? We'd love to hear from you!<br />
                Email: info@fretnoodle.com
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;