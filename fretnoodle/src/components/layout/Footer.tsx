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
        py: 1,
        px: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} FretNoodle. All rights reserved.
          </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
