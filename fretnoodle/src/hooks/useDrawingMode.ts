import { useState, useCallback, useEffect, useRef } from 'react';
import { DrawingPoint } from '../types/fretboard';

/**
 * Hook to manage drawing mode functionality
 * @param initialDrawingMode - Initial drawing mode state
 * @param isFullscreen - Current fullscreen state
 * @returns Drawing state and control functions
 */
export function useDrawingMode(initialDrawingMode: boolean = false, isFullscreen: boolean) {
  const [isDrawingMode, setIsDrawingMode] = useState(initialDrawingMode);
  const [drawingPoints, setDrawingPoints] = useState<DrawingPoint[]>([]);
  
  // Use refs to ensure p5 sketch has access to latest state
  const drawingModeRef = useRef(isDrawingMode);
  const drawingPointsRef = useRef(drawingPoints);
  
  // Update refs when state changes
  useEffect(() => {
    drawingModeRef.current = isDrawingMode;
  }, [isDrawingMode]);
  
  useEffect(() => {
    drawingPointsRef.current = drawingPoints;
  }, [drawingPoints]);

  // Simple function to toggle drawing mode
  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode(prev => !prev);
    console.log("Drawing mode toggled:", !isDrawingMode);
  }, [isDrawingMode]);

  // Handle keyboard events - simplified approach
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'd' && isFullscreen) {
        toggleDrawingMode();
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen, toggleDrawingMode]);

  const clearDrawing = () => {
    drawingPointsRef.current = [];
    setDrawingPoints([]);
  };

  return { 
    isDrawingMode, 
    setIsDrawingMode, 
    drawingPoints, 
    setDrawingPoints,
    drawingModeRef,
    drawingPointsRef,
    toggleDrawingMode,
    clearDrawing
  };
}