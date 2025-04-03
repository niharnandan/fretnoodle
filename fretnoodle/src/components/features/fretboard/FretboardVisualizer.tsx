import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Box, Button, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import P5Canvas from '../../layout/common/P5Canvas';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { useDrawingMode } from '../../../hooks/useDrawingMode';
import useFretboardStates, { SavedFretboardState } from '../../../hooks/useFretboardStates';
import FretboardStates from './FretboardStates';
import { createFretboardSketch } from '../../../utils/fretBoardSketch';
import { FretboardVisualizerProps, FretboardState } from '../../../types/fretboard';

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
  
  // Flag to track if we should auto-update the current state
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  
  // Reference to track fullscreen transitions
  const wasFullscreen = useRef(false);
  
  // Reference to current fretboard state for p5 sketch
  const fretboardStateRef = useRef(fretboardState);
  // Reference to theme for p5 sketch
  const themeRef = useRef(isDarkMode);
  
  // Keep the last stable state for faster transitions
  const lastStableStateRef = useRef<FretboardState | null>(null);
  
  // Previous fretboard state to detect changes for auto-updating
  const prevFretboardStateRef = useRef<FretboardState | null>(null);

  // Update stable state ref when state stabilizes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      lastStableStateRef.current = { ...fretboardState };
    }, 200); // Wait 200ms after last state change
    
    return () => clearTimeout(timeoutId);
  }, [fretboardState]);
  
  // Get drawing mode functionality
  const { 
    isDrawingMode, 
    setIsDrawingMode,
    drawingPoints,
    drawingModeRef,
    drawingPointsRef,
    toggleDrawingMode,
    clearDrawing,
    setDrawingPoints
  } = useDrawingMode(false, false); // Initially pass false for fullscreen
  
  // Get fullscreen functionality (passing drawing mode to ensure proper toggling)
  const { isFullscreen, toggleFullscreen } = useFullscreen(false, isDrawingMode, setIsDrawingMode);
  
  const { 
    savedStates, 
    sortedStates,
    addState, 
    addAndSelectState,
    updateState,
    deleteState, 
    loadState, 
    getLastLoadedState, 
    lastLoadedStateId 
  } = useFretboardStates();

  // Force direct state selection
  const selectStateById = useCallback((stateId: string) => {
    // Force direct state loading outside of React's normal flow
    const loadedData = loadState(stateId);
    if (loadedData && onStateLoad) {
      // Use a stable state for faster loading
      if (lastStableStateRef.current) {
        onStateLoad({
          ...lastStableStateRef.current,
          ...loadedData.state
        });
      } else {
        onStateLoad(loadedData.state);
      }
      
      // For absolutely guaranteed state selection, directly trigger a click on the state button
      setTimeout(() => {
        const stateButton = document.querySelector(`button[data-state-id="${stateId}"]`);
        if (stateButton) {
          (stateButton as HTMLButtonElement).click();
        }
      }, 100);
    }
  }, [loadState, onStateLoad]);

  // Handle adding current state - memoized to avoid recreating on each render
  const handleAddState = useCallback(() => {
    // Save current state if one is selected
    if (lastLoadedStateId) {
      updateState(lastLoadedStateId, fretboardState, drawingPointsRef.current);
    }
    
    // Create a new empty state
    const newStateId = addState(fretboardState, [], true);
    
    // Clear the drawing points
    clearDrawing();
    
    // Create an empty state manually
    const emptyState: FretboardState = {
      ...fretboardState,
      selectedNotes: [],
      rootNote: null,
      detectedChord: null
    };
    
    // Explicitly apply the empty state to the fretboard
    if (onStateLoad) {
      onStateLoad(emptyState);
    }
    
    // Enable auto-update for the new state
    setAutoUpdateEnabled(true);
    
    // Force a reload of the state after a short delay
    setTimeout(() => {
      // Load the state again after React has had time to process state updates
      const loadedData = loadState(newStateId);
      if (loadedData && onStateLoad) {
        onStateLoad(loadedData.state);
      }
    }, 50);
  }, [addState, updateState, loadState, onStateLoad, fretboardState, drawingPointsRef, lastLoadedStateId, clearDrawing]);
  
  // Handle loading a saved state - memoized for performance
  const handleLoadState = useCallback((stateId: string) => {
    // First, save the current drawing to the current state
    if (lastLoadedStateId) {
      // Update the current state with current drawing from the ref to ensure latest data
      updateState(lastLoadedStateId, fretboardState, drawingPointsRef.current);
    }
    
    // Now load the requested state
    const loadedData = loadState(stateId);
    if (loadedData && onStateLoad) {
      // Apply a transition effect using CSS class
      const container = document.getElementById('fretboard-visualizer');
      if (container) {
        // First make it slightly transparent
        container.style.opacity = '0.8';
        
        // After a very short delay, start transition back to full opacity
        setTimeout(() => {
          container.style.opacity = '1';
        }, 10);
      }
      
      // Load the fretboard state
      onStateLoad(loadedData.state);
      
      // Load the drawing points - ensure we update both state and ref
      setDrawingPoints([...loadedData.drawingPoints]);
      drawingPointsRef.current = [...loadedData.drawingPoints];
      
      // Enable auto-update for this state
      setAutoUpdateEnabled(true);
      
      // Update the previous state reference for proper comparison
      prevFretboardStateRef.current = { ...loadedData.state };
    }
  }, [
    loadState, 
    onStateLoad, 
    setDrawingPoints, 
    drawingPointsRef, 
    lastLoadedStateId, 
    updateState, 
    fretboardState
  ]);

  // Handle deleting a state - memoized for performance
  const handleDeleteState = useCallback((stateId: string): string | null => {
    const nextStateId = deleteState(stateId);
    
    // If we have a next state ID, load it immediately
    if (nextStateId) {
      handleLoadState(nextStateId);
    } else if (!nextStateId) {
      // If there's no next state, clear the fretboard
      if (onStateLoad) {
        const emptyState: FretboardState = {
          ...fretboardState,
          selectedNotes: [],
          rootNote: null,
          detectedChord: null
        };
        onStateLoad(emptyState);
        clearDrawing();
      }
    }
    
    return nextStateId;
  }, [deleteState, handleLoadState, onStateLoad, fretboardState, clearDrawing]);
  
  // Effect to handle auto-creation of state when entering fullscreen
  useEffect(() => {
    // Check if we just entered fullscreen
    if (isFullscreen && !wasFullscreen.current) {
      // If there are no states yet, create an empty one regardless of current note selection
      if (sortedStates.length === 0) {
        const result = addAndSelectState(fretboardState, [], true);
        
        if (result.loadedData && onStateLoad) {
          onStateLoad(result.loadedData.state);
          setDrawingPoints([...result.loadedData.drawingPoints]);
        }
        
        setAutoUpdateEnabled(true);
      }
    }
    
    // Update the ref to track changes
    wasFullscreen.current = isFullscreen;
  }, [isFullscreen, fretboardState, sortedStates.length, addAndSelectState, onStateLoad, setDrawingPoints]);
  
  // Enhanced toggleFullscreen handler
  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      // We're exiting fullscreen, save the current state and its drawings
      if (lastLoadedStateId) {
        updateState(lastLoadedStateId, fretboardState, drawingPointsRef.current);
      }
      
      // Apply the last loaded state
      const lastState = getLastLoadedState();
      if (lastState && onStateLoad) {
        onStateLoad(lastState.state);
      }
    } else {
      // We're entering fullscreen
      setAutoUpdateEnabled(false);
      
      // Load the last state if one exists
      const lastState = getLastLoadedState();
      if (lastState) {
        if (onStateLoad) {
          onStateLoad(lastState.state);
        }
        setDrawingPoints(lastState.drawingPoints);
      } else if (sortedStates.length > 0) {
        // If no last state but states exist, load the first one
        handleLoadState(sortedStates[0].id);
      }
    }
    
    toggleFullscreen();
  }, [
    isFullscreen, 
    lastLoadedStateId, 
    updateState, 
    fretboardState, 
    getLastLoadedState, 
    onStateLoad, 
    setDrawingPoints, 
    sortedStates, 
    handleLoadState,
    toggleFullscreen,
    drawingPointsRef
  ]);
  
  // Effect for auto-updating the current state when fretboardState changes
  useEffect(() => {
    // Skip this effect if no state is selected or auto-update is disabled
    if (!lastLoadedStateId || !autoUpdateEnabled || !isFullscreen) return;

    // Compare current state with previous state to detect changes
    if (prevFretboardStateRef.current) {
      const prevSelectionJSON = JSON.stringify(prevFretboardStateRef.current.selectedNotes);
      const currSelectionJSON = JSON.stringify(fretboardState.selectedNotes);
      
      if (prevSelectionJSON !== currSelectionJSON) {
        // Selected notes have changed, update the current state
        // Use the current drawing points from the ref to ensure we're getting the latest
        updateState(lastLoadedStateId, fretboardState, drawingPointsRef.current);
      }
    }
    
    // Update previous state reference
    prevFretboardStateRef.current = { ...fretboardState };
  }, [fretboardState, lastLoadedStateId, autoUpdateEnabled, isFullscreen, updateState, drawingPointsRef]);
  
  // Update refs when state changes
  useEffect(() => {
    fretboardStateRef.current = fretboardState;
  }, [fretboardState]);
  
  useEffect(() => {
    themeRef.current = isDarkMode;
  }, [isDarkMode]);

  // Add event listeners for keyboard shortcuts
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
      // If we have a selected state, enable auto-update
      if (lastLoadedStateId && isFullscreen) {
        setAutoUpdateEnabled(true);
      }
      
      onNoteClick(stringIndex, fret);
    }
  }, [onNoteClick, lastLoadedStateId, isFullscreen]);

  // Handle clearing all selections in fullscreen mode
  const handleClearAllSelections = useCallback(() => {
    if (onStateLoad) {
      // Create an empty state copy that keeps tuning and other settings
      const emptyState = {
        ...fretboardState,
        selectedNotes: [],
        rootNote: null,
        detectedChord: null
      };
      
      // Apply the state change to the UI
      onStateLoad(emptyState);
      
      // If we have a selected state, update it
      if (lastLoadedStateId) {
        // First, update the state data with the empty state
        updateState(lastLoadedStateId, emptyState, drawingPointsRef.current);
        
        // Then, find the current state in saved states
        const currentState = savedStates.find(state => state.id === lastLoadedStateId);
        
        // If the state was named after a chord (not the default State X format)
        // we need to reset the name by recreating the state
        if (currentState && 
            (currentState.state.detectedChord || 
            !currentState.name.startsWith('State '))) {
            
          // First, get the position for the state number
          const stateIndex = sortedStates.findIndex(state => state.id === lastLoadedStateId);
          const stateNumber = stateIndex !== -1 ? stateIndex + 1 : savedStates.length;
          
          // Delete and recreate the state to rename it
          // Save the drawings first
          const currentDrawings = [...drawingPointsRef.current];
          
          // Delete current state
          deleteState(lastLoadedStateId);
          
          // Add a new state with the proper name format
          // The true parameter forces it to use the "State X" naming format
          const newStateId = addState(emptyState, currentDrawings, true);
          
          // Select the new state
          handleLoadState(newStateId);
        }
      }
    }
  }, [fretboardState, onStateLoad, lastLoadedStateId, updateState, savedStates, sortedStates, 
      drawingPointsRef, deleteState, addState, handleLoadState]);
  
  // Create the p5 sketch with all necessary references and the fullscreen flag
  const memoizedSketch = useMemo(() => {
    return createFretboardSketch(
      fretboardStateRef,
      drawingModeRef,
      drawingPointsRef,
      themeRef,
      handleNoteClick,
      width,
      height,
      isFullscreen
    );
  }, [width, height, isFullscreen, handleNoteClick]);

  // Prepare the CSS class for the container with a transition effect
  const containerClass = useMemo(() => {
    return isFullscreen ? 'fretboard-container-fullscreen' : 'fretboard-container';
  }, [isFullscreen]);

  return (
    <Box 
      className={containerClass}
      sx={{ 
        width: isFullscreen ? '100vw' : '100%', 
        height: isFullscreen ? '100vh' : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 1000 : 'auto',
        border: isFullscreen ? 'none' : '1px solid',
        borderColor: 'divider',
        borderRadius: isFullscreen ? 0 : 1,
        overflow: 'hidden',
        boxShadow: isFullscreen ? 'none' : 2,
        bgcolor: 'background.default',
        px: 0.75,
        py: 1,
        transition: 'opacity 0.15s ease-out', // Add transition effect
      }}
    >
      {isFullscreen && (
        <Box sx={{ 
          position: 'absolute', 
          top: '5px',
          right: '5px',
          zIndex: 1001,
          backgroundColor: 'background.paper',
          padding: '3px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          boxShadow: 2,
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isFullscreen} 
                onChange={handleToggleFullscreen} 
                color="primary"
                size="small"
              />
            }
            label="Fullscreen Mode"
            sx={{ margin: '0px', fontSize: '0.85rem' }}
          />
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={clearDrawing}
            color="secondary"
            size="small"
            sx={{ padding: '2px 8px' }}
          >
            Clear Drawing
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DeleteOutlineIcon />} 
            onClick={handleClearAllSelections}
            color="warning"
            size="small"
            sx={{ padding: '2px 8px' }}
          >
            Clear All Selections
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
          savedStates={sortedStates}
          onAddState={handleAddState}
          onDeleteState={handleDeleteState}
          onLoadState={handleLoadState}
          currentStateId={lastLoadedStateId}
        />
      )}
    </Box>
  );
});

export default FretboardVisualizer;