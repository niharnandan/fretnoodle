import React from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';

interface P5CanvasProps {
  sketch: (p: p5) => void;
  width?: string | number;
  height?: string | number;
  id: string;
}

const P5Canvas: React.FC<P5CanvasProps> = ({ 
  sketch, 
  width = '100%', 
  height = 'auto',
  id
}) => {
  // Use useEffect to create the p5 instance after the component is mounted
  React.useEffect(() => {
    // Initialize p5 instance
    let p5Instance: p5 | null = null;
    
    // Get the container element
    const container = document.getElementById(id);
    
    if (container) {
      p5Instance = new p5(sketch, container);
    }
    
    // Cleanup function
    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [sketch, id]); // Dependencies: sketch function and container id

  return (
    <Box
      id={id}
      sx={{
        width,
        height,
        '& canvas': {
          display: 'block',
        },
      }}
    />
  );
};

export default P5Canvas;