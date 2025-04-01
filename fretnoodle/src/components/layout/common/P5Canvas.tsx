import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';

interface P5CanvasProps {
  sketch: (p: p5) => void;
  width?: string | number;
  height?: string | number;
  id: string;
}

const P5Canvas: React.FC<P5CanvasProps> = React.memo(({ 
  sketch, 
  width = '100%', 
  height = 'auto',
  id
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sketchInstance = useRef<p5 | null>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    
    if (container && !sketchInstance.current) {
      sketchInstance.current = new p5(sketch, container);
    }
    
    return () => {
      if (sketchInstance.current) {
        sketchInstance.current.remove();
        sketchInstance.current = null;
      }
    };
  }, [sketch]);

  useEffect(() => {
    const handleResize = () => {
      if (sketchInstance.current) {
        sketchInstance.current.windowResized();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      id={id}
      ref={containerRef}
      sx={{
        width,
        height,
        '& canvas': {
          display: 'block',
        },
      }}
    />
  );
});

export default P5Canvas;
