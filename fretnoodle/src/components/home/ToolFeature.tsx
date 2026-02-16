import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface ToolFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const ToolFeature: React.FC<ToolFeatureProps> = ({
  icon,
  title,
  description,
  delay = 0
}) => {
  const theme = useTheme();

  return (
    <Box
      className="tool-feature"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0, // Start invisible, animation will make it visible
      }}
      sx={{
        textAlign: 'center',
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
        borderRadius: 4,
        boxShadow: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}
    >
      <Box
        sx={{
          color: theme.palette.primary.main,
          display: 'flex',
          justifyContent: 'center',
          mb: 2
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'inherit'
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default ToolFeature;
