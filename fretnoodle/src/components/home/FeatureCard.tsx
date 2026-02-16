import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  image,
  buttonText,
  buttonLink,
  delay = 0
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      className="feature-card"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0, // Start invisible, animation will make it visible
      }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, flexGrow: 1 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(buttonLink)}
          sx={{
            borderRadius: 8,
            py: 1.2,
            alignSelf: 'flex-start',
            boxShadow: 3
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
