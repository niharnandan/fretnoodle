import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Box, Button, Checkbox, FormControlLabel, useTheme } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MapIcon from '@mui/icons-material/Map';
import KonvaFretboard from './KonvaFretboard';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { useDrawingMode } from '../../../hooks/useDrawingMode';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import useFretboardStates from '../../../hooks/useFretboardStates';
import FretboardStates from './FretboardStates';
import { createFretboardColors } from '../../../utils/fretboardColors';
import { FretboardVisualizerProps, FretboardState } from '../../../types/fretboard';
import AnimatedButton from '../../common/AnimatedButtonDelete';

const FretboardVisualizer: React.FC<FretboardVisualizerProps> = React.memo(({
  fretboardState,
  width = 1000,
  height = 300,
  onNoteClick,
  onStateLoad
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Flag to track if we should auto-update the current state
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  // Map mode state
  const [isMapMode, setIsMapMode] = useState(false);
  const [mappedNotes, setMappedNotes] = useState<string[]>([]);

  // Store map mode state per state ID
  const [stateMapModes, setStateMapModes] = useState<Record<string, {isMapMode: boolean, mappedNotes: string[]}>>({});

  // Reference to track fullscreen transitions
  const wasFullscreen = useRef(false);

  // Keep the last stable state for faster transitions
  const lastStableStateRef = useRef<FretboardState | null>(null);

  // Previous fretboard state to detect changes for auto-updating
  const prevFretboardStateRef = useRef<FretboardState | null>(null);

  // Compute colors from theme
  const colors = useMemo(() => createFretboardColors(isDarkMode), [isDarkMode]);

  // Update stable state ref when state stabilizes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      lastStableStateRef.current = { ...fretboardState };
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [fretboardState]);

  // Get drawing mode functionality (simplified — no refs)
  const {
    isDrawingMode,
    setIsDrawingMode,
    drawingPoints,
    setDrawingPoints,
    toggleDrawingMode,
    clearDrawing,
  } = useDrawingMode(false);

  // Get fullscreen functionality
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
    lastLoadedStateId,
    reorderStates,
    copyState
  } = useFretboardStates();

  // Handle adding current state
  const handleAddState = useCallback(() => {
    if (lastLoadedStateId) {
      updateState(lastLoadedStateId, fretboardState, drawingPoints);

      setStateMapModes(prev => ({
        ...prev,
        [lastLoadedStateId]: { isMapMode, mappedNotes }
      }));
    }

    const newStateId = addState(fretboardState, [], true);

    clearDrawing();

    const emptyState: FretboardState = {
      ...fretboardState,
      selectedNotes: [],
      rootNote: null,
      detectedChord: null
    };

    if (onStateLoad) {
      onStateLoad(emptyState);
    }

    setAutoUpdateEnabled(true);
    setIsMapMode(false);
    setMappedNotes([]);

    setStateMapModes(prev => ({
      ...prev,
      [newStateId]: { isMapMode: false, mappedNotes: [] }
    }));

    setTimeout(() => {
      const loadedData = loadState(newStateId);
      if (loadedData && onStateLoad) {
        onStateLoad(loadedData.state);
      }
    }, 50);
  }, [addState, updateState, loadState, onStateLoad, fretboardState, drawingPoints, lastLoadedStateId, clearDrawing, isMapMode, mappedNotes]);

  // Handle loading a saved state
  const handleLoadState = useCallback((stateId: string) => {
    if (lastLoadedStateId) {
      updateState(lastLoadedStateId, fretboardState, drawingPoints);

      setStateMapModes(prev => ({
        ...prev,
        [lastLoadedStateId]: { isMapMode, mappedNotes }
      }));
    }

    const loadedData = loadState(stateId);
    if (loadedData && onStateLoad) {
      const container = document.getElementById('fretboard-visualizer');
      if (container) {
        container.style.opacity = '0.8';
        setTimeout(() => {
          container.style.opacity = '1';
        }, 10);
      }

      onStateLoad(loadedData.state);
      setDrawingPoints([...loadedData.drawingPoints]);

      const stateMapMode = stateMapModes[stateId];
      if (stateMapMode) {
        setIsMapMode(stateMapMode.isMapMode);
        setMappedNotes(stateMapMode.mappedNotes);
      } else {
        setIsMapMode(false);
        setMappedNotes([]);
      }

      setAutoUpdateEnabled(true);
      prevFretboardStateRef.current = { ...loadedData.state };
    }
  }, [
    loadState,
    onStateLoad,
    setDrawingPoints,
    lastLoadedStateId,
    updateState,
    fretboardState,
    drawingPoints,
    isMapMode,
    mappedNotes,
    stateMapModes
  ]);

  // Handle deleting a state
  const handleDeleteState = useCallback((stateId: string): string | null => {
    const nextStateId = deleteState(stateId);

    setStateMapModes(prev => {
      const newMapModes = { ...prev };
      delete newMapModes[stateId];
      return newMapModes;
    });

    if (nextStateId) {
      handleLoadState(nextStateId);
    } else if (!nextStateId) {
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

      setIsMapMode(false);
      setMappedNotes([]);
    }

    return nextStateId;
  }, [deleteState, handleLoadState, onStateLoad, fretboardState, clearDrawing]);

  // Effect to handle auto-creation of state when entering fullscreen
  useEffect(() => {
    if (isFullscreen && !wasFullscreen.current) {
      if (sortedStates.length === 0) {
        const result = addAndSelectState(fretboardState, [], true);

        if (result.loadedData && onStateLoad) {
          onStateLoad(result.loadedData.state);
          setDrawingPoints([...result.loadedData.drawingPoints]);
        }

        setAutoUpdateEnabled(true);
        setIsMapMode(false);
        setMappedNotes([]);
      }
    }

    wasFullscreen.current = isFullscreen;
  }, [isFullscreen, fretboardState, sortedStates.length, addAndSelectState, onStateLoad, setDrawingPoints]);

  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      if (lastLoadedStateId) {
        updateState(lastLoadedStateId, fretboardState, drawingPoints);

        setStateMapModes(prev => ({
          ...prev,
          [lastLoadedStateId]: { isMapMode, mappedNotes }
        }));
      }

      const lastState = getLastLoadedState();
      if (lastState && onStateLoad) {
        onStateLoad(lastState.state);
      }
    } else {
      setAutoUpdateEnabled(false);

      const lastState = getLastLoadedState();
      if (lastState) {
        if (onStateLoad) {
          onStateLoad(lastState.state);
        }
        setDrawingPoints(lastState.drawingPoints);

        if (lastLoadedStateId) {
          const mapModeState = stateMapModes[lastLoadedStateId];
          if (mapModeState) {
            setIsMapMode(mapModeState.isMapMode);
            setMappedNotes(mapModeState.mappedNotes);
          } else {
            setIsMapMode(false);
            setMappedNotes([]);
          }
        }
      } else if (sortedStates.length > 0) {
        handleLoadState(sortedStates[0].id);
      }
    }

    toggleFullscreen();
  }, [
    isFullscreen,
    lastLoadedStateId,
    updateState,
    fretboardState,
    drawingPoints,
    getLastLoadedState,
    onStateLoad,
    setDrawingPoints,
    sortedStates,
    handleLoadState,
    toggleFullscreen,
    isMapMode,
    mappedNotes,
    stateMapModes
  ]);

  const handleCopyState = useCallback((stateId: string) => {
    if (lastLoadedStateId) {
      updateState(lastLoadedStateId, fretboardState, drawingPoints);
    }

    const newStateId = copyState(stateId);

    const container = document.getElementById('fretboard-visualizer');
    if (container) {
      container.style.opacity = '0.8';
      setTimeout(() => {
        container.style.opacity = '1';
      }, 10);
    }

    setTimeout(() => {
      const loadedData = loadState(newStateId);
      if (loadedData && onStateLoad) {
        onStateLoad(loadedData.state);
      }
    }, 50);
  }, [
    copyState,
    loadState,
    onStateLoad,
    updateState,
    fretboardState,
    lastLoadedStateId,
    drawingPoints
  ]);

  const handleReorderStates = useCallback((stateIds: string[]) => {
    if (lastLoadedStateId) {
      updateState(lastLoadedStateId, fretboardState, drawingPoints);
    }

    reorderStates(stateIds);
  }, [
    reorderStates,
    updateState,
    fretboardState,
    lastLoadedStateId,
    drawingPoints
  ]);

  // Effect for auto-updating the current state when fretboardState changes
  useEffect(() => {
    if (!lastLoadedStateId || !autoUpdateEnabled || !isFullscreen) return;

    if (prevFretboardStateRef.current) {
      const prevSelectionJSON = JSON.stringify(prevFretboardStateRef.current.selectedNotes);
      const currSelectionJSON = JSON.stringify(fretboardState.selectedNotes);

      if (prevSelectionJSON !== currSelectionJSON) {
        updateState(lastLoadedStateId, fretboardState, drawingPoints);
      }
    }

    prevFretboardStateRef.current = { ...fretboardState };
  }, [fretboardState, lastLoadedStateId, autoUpdateEnabled, isFullscreen, updateState, drawingPoints]);

  // New handler for the Map Mode toggle
  const handleToggleMapMode = useCallback(() => {
    if (isMapMode) {
      setMappedNotes([]);
      setIsMapMode(false);

      if (lastLoadedStateId) {
        setStateMapModes(prev => ({
          ...prev,
          [lastLoadedStateId]: { isMapMode: false, mappedNotes: [] }
        }));
      }
    } else {
      const distinctNotes = Array.from(
        new Set(fretboardState.selectedNotes.map(note => note.note))
      );

      setMappedNotes(distinctNotes);
      setIsMapMode(true);

      if (lastLoadedStateId) {
        setStateMapModes(prev => ({
          ...prev,
          [lastLoadedStateId]: { isMapMode: true, mappedNotes: distinctNotes }
        }));
      }
    }
  }, [isMapMode, fretboardState.selectedNotes, lastLoadedStateId]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    isFullscreen,
    onToggleFullscreen: handleToggleFullscreen,
    onToggleDrawingMode: toggleDrawingMode,
    onToggleMapMode: handleToggleMapMode,
  });

  // Note click handler
  const handleNoteClick = useCallback((stringIndex: number, fret: number) => {
    if (onNoteClick) {
      if (lastLoadedStateId && isFullscreen) {
        setAutoUpdateEnabled(true);
      }

      onNoteClick(stringIndex, fret);
    }
  }, [onNoteClick, lastLoadedStateId, isFullscreen]);

  // Handle clearing all selections in fullscreen mode
  const handleClearAllSelections = useCallback(() => {
    if (onStateLoad) {
      const emptyState = {
        ...fretboardState,
        selectedNotes: [],
        rootNote: null,
        detectedChord: null
      };

      onStateLoad(emptyState);

      if (lastLoadedStateId) {
        updateState(lastLoadedStateId, emptyState, drawingPoints);

        const currentState = savedStates.find(state => state.id === lastLoadedStateId);

        if (currentState &&
            (currentState.state.detectedChord ||
            !currentState.name.startsWith('State '))) {
          const currentDrawings = [...drawingPoints];

          deleteState(lastLoadedStateId);

          const newStateId = addState(emptyState, currentDrawings, true);

          handleLoadState(newStateId);
        }
      }

      setMappedNotes([]);
      setIsMapMode(false);

      if (lastLoadedStateId) {
        setStateMapModes(prev => ({
          ...prev,
          [lastLoadedStateId]: { isMapMode: false, mappedNotes: [] }
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fretboardState, onStateLoad, lastLoadedStateId, updateState, savedStates, sortedStates,
      drawingPoints, deleteState, addState, handleLoadState]);

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
        transition: 'opacity 0.15s ease-out',
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
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={clearDrawing}
            color="secondary"
            size="small"
            sx={{ padding: '2px 8px' }}
          >
            Clear Drawing
          </Button>
          <AnimatedButton clickAction={handleClearAllSelections}/>
          <Button
            variant="contained"
            startIcon={<MapIcon />}
            onClick={handleToggleMapMode}
            color={isMapMode ? "primary" : "secondary"}
            size="small"
            sx={{ padding: '2px 8px' }}
          >
            {isMapMode ? "Unmap Notes" : "Map Notes"}
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

      <KonvaFretboard
        fretboardState={fretboardState}
        colors={colors}
        mappedNotes={mappedNotes}
        width={width}
        height={height}
        isFullscreen={isFullscreen}
        isDrawingMode={isDrawingMode}
        isDarkMode={isDarkMode}
        drawingPoints={drawingPoints}
        onDrawingPointsChange={setDrawingPoints}
        onNoteClick={handleNoteClick}
        id="fretboard-visualizer"
      />

      {isFullscreen && (
        <FretboardStates
          savedStates={sortedStates}
          onAddState={handleAddState}
          onDeleteState={handleDeleteState}
          onLoadState={handleLoadState}
          onCopyState={handleCopyState}
          onReorderStates={handleReorderStates}
          currentStateId={lastLoadedStateId}
        />
      )}
    </Box>
  );
});

export default FretboardVisualizer;
