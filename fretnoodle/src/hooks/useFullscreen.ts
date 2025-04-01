import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage fullscreen mode functionality
 * @param initialMode - Initial fullscreen state
 * @param isDrawingMode - Current drawing mode state
 * @param setIsDrawingMode - Function to update drawing mode
 * @returns Fullscreen state and toggle function
 */
export function useFullscreen(
  initialMode: boolean = false, 
  isDrawingMode: boolean,
  setIsDrawingMode: (mode: boolean) => void
) {
  const [isFullscreen, setIsFullscreen] = useState(initialMode);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    // Turn off drawing mode when exiting fullscreen
    if (isFullscreen && isDrawingMode) {
      setIsDrawingMode(false);
    }
    
    setIsFullscreen(!isFullscreen);
    
    // Toggle body overflow to prevent scrolling in fullscreen mode
    document.body.style.overflow = !isFullscreen ? 'hidden' : 'auto';
    
    // Hide/show navbar and footer
    const navbar = document.querySelector('header') || document.querySelector('nav');
    const footer = document.querySelector('footer');
    
    if (navbar) {
      navbar.style.display = !isFullscreen ? 'none' : 'block';
    }
    
    if (footer) {
      footer.style.display = !isFullscreen ? 'none' : 'block';
    }
  }, [isFullscreen, isDrawingMode, setIsDrawingMode]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
      
      const navbar = document.querySelector('header') || document.querySelector('nav');
      const footer = document.querySelector('footer');
      
      if (navbar) navbar.style.display = 'block';
      if (footer) footer.style.display = 'block';
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
}