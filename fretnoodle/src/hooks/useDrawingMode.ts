import { useState, useCallback } from 'react';
import { DrawingPoint } from '../types/fretboard';

export function useDrawingMode(initialDrawingMode: boolean = false) {
  const [isDrawingMode, setIsDrawingMode] = useState(initialDrawingMode);
  const [drawingPoints, setDrawingPoints] = useState<DrawingPoint[]>([]);

  const toggleDrawingMode = useCallback(() => {
    setIsDrawingMode(prev => !prev);
  }, []);

  const clearDrawing = useCallback(() => {
    setDrawingPoints([]);
  }, []);

  return {
    isDrawingMode,
    setIsDrawingMode,
    drawingPoints,
    setDrawingPoints,
    toggleDrawingMode,
    clearDrawing,
  };
}

export default useDrawingMode;
