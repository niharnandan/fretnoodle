// FILE: components/features/fretboard/FretboardVisualizer.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Button, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import P5Canvas from '../../layout/common/P5Canvas';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { useDrawingMode } from '../../../hooks/useDrawingMode';
import useFretboardStates from '../../../hooks/useFretboardStates';
import { createFretboardSketch } from '../../../utils/fretBoardSketch';
import { FretboardVisualizerProps } from '../../../types/fretboard';
import FretboardStates from './FretboardStates';

/**
 * Main FretboardVisualizer component
 * Handles the visualizer's state and connections to other components
 */
const FretboardVisualizer: React.FC<FretboardVisualizerProps> = React.memo(({
  fretboardState,
  width = 1000,
  height = 300,
  onNoteClick,
  onStateLoad
}) => {
  const theme = useTheme(); // Access MUI theme
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Reference to current fretboard state for p5 sketch
  const fretboardStateRef = useRef(fretboardState);
  // Reference to theme for p5 sketch
  const themeRef = useRef(isDarkMode);
  
  // Get drawing mode functionality
  const { 
    isDrawingMode, 
    setIsDrawingMode,
    drawingPoints,
    drawingModeRef,
    drawingPointsRef,
    toggleDrawingMode,
    clearDrawing
  } = useDrawingMode(false, false); // Initially pass false for fullscreen
  
  // State management hook
  const { savedStates, addState, deleteState, loadState, getLastLoadedState, lastLoadedStateId } = useFretboardStates();
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(false, isDrawingMode, setIsDrawingMode);

  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      // We're exiting fullscreen, check if we need to apply the last loaded state
      const lastState = getLastLoadedState();
      if (lastState && onStateLoad) {
        onStateLoad(lastState);
      }
    }
    toggleFullscreen();
  }, [isFullscreen, getLastLoadedState, onStateLoad, toggleFullscreen]);
    
  // Update refs when state changes
  useEffect(() => {
    fretboardStateRef.current = fretboardState;
  }, [fretboardState]);
  
  useEffect(() => {
    themeRef.current = isDarkMode;
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        handleToggleFullscreen();
      }
      if (event.key === "d" && isFullscreen) {
        toggleDrawingMode();
      }
      if (event.key === "f") {
        handleToggleFullscreen();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, handleToggleFullscreen, toggleDrawingMode]);
  
  // Create a custom note click handler that doesn't trigger re-renders
  const handleNoteClick = useCallback((stringIndex: number, fret: number) => {
    if (onNoteClick) {
      onNoteClick(stringIndex, fret);
    }
  }, [onNoteClick]);
  
  // Handle adding current state
  const handleAddState = useCallback(() => {
    addState(fretboardState);
  }, [addState, fretboardState]);
  
  // Handle loading a saved state
  const handleLoadState = useCallback((stateId: string) => {
    const stateToLoad = loadState(stateId);
    if (stateToLoad && onStateLoad) {
      onStateLoad(stateToLoad);
    }
  }, [loadState, onStateLoad]);
  
  // Create the p5 sketch with all necessary references and the fullscreen flag
  const memoizedSketch = React.useMemo(() => {
    return createFretboardSketch(
      fretboardStateRef,
      drawingModeRef,
      drawingPointsRef,
      themeRef,
      handleNoteClick,
      width,
      height,
      isFullscreen // Pass the fullscreen flag to control spacing in the sketch
    );
  }, [width, height, isFullscreen, handleNoteClick]);

  return (
    <Box 
      sx={{ 
        width: isFullscreen ? '100vw' : '100%', 
        height: isFullscreen ? '100vh' : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1000 : 'auto',
        border: isFullscreen ? 'none' : '1px solid',
        borderColor: 'divider', // Uses theme's divider color
        borderRadius: isFullscreen ? 0 : 1,
        overflow: 'hidden',
        boxShadow: isFullscreen ? 'none' : 2,
        bgcolor: 'background.default', // Uses theme's background color for container
        px: 0.75,
        py: 1
      }}
    >
      {isFullscreen && (
        <Box sx={{ 
          position: 'absolute', 
          top: '5px', // Reduced from 10px
          right: '5px', // Reduced from 10px
          zIndex: 1001,
          backgroundColor: 'background.paper', // Theme-aware background
          padding: '3px', // Reduced from 5px
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5, // Reduced from 1
          boxShadow: 2,
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFullscreen} 
                onChange={handleToggleFullscreen} 
                color="primary"
                size="small" // Smaller checkbox in fullscreen
              />
            }
            label="Fullscreen Mode"
            sx={{ margin: '0px', fontSize: '0.85rem' }} // Compact label
          />
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={clearDrawing}
            color="secondary"
            size="small"
            sx={{ padding: '2px 8px' }} // Compact button
          >
            Clear Drawing
          </Button>
        </Box>
      )}
      
      {!isFullscreen && (
        <Box sx={{ 
          position: 'absolute', 
          top: '-5px', 
          right: '-10px', 
          zIndex: 1,
          padding: '5px',
          borderRadius: '5px',
          opacity: 0.8
        }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={isFullscreen} 
                onChange={handleToggleFullscreen} 
                color="primary"
              />
            }
            label="Fullscreen Mode"
          />
        </Box>
      )}
      
      <P5Canvas 
        sketch={memoizedSketch} 
        id="fretboard-visualizer"
        width={isFullscreen ? '100%' : width}
        height={isFullscreen ? '100%' : height}
      />
      
      {/* State management UI - only visible in fullscreen mode */}
      {isFullscreen && (
        <FretboardStates
          savedStates={savedStates}
          onAddState={handleAddState}
          onDeleteState={deleteState}
          onLoadState={handleLoadState}
        />
      )}
    </Box>
  );
});

export default FretboardVisualizer;