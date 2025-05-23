import { useState, useCallback, useRef } from 'react';
import { FretboardState, DrawingPoint } from '../types/fretboard';

export interface SavedFretboardState {
  id: string;
  name: string;
  state: FretboardState;
  drawingPoints: DrawingPoint[];
  createdAt: number; // Timestamp for consistent ordering
}

export function useFretboardStates() {
  const [savedStates, setSavedStates] = useState<SavedFretboardState[]>([]);
  // Track the last loaded state ID
  const lastLoadedStateId = useRef<string | null>(null);

  // Add a new state
  const addState = useCallback((currentState: FretboardState, drawingPoints: DrawingPoint[], emptyState: boolean = false) => {
    let newStateId = '';
    
    setSavedStates(prevStates => {
      // Create a unique ID
      const id = `state-${Date.now()}`;
      newStateId = id;
      
      // For empty states, always use the numbered naming scheme
      // For non-empty states, use chord name if available
      
      // Find the highest state number currently in use to avoid duplicates
      const stateNumberPattern = /^State (\d+)$/;
      const highestStateNumber = prevStates.reduce((highest, state) => {
        const match = state.name.match(stateNumberPattern);
        if (match) {
          const stateNum = parseInt(match[1], 10);
          return Math.max(highest, stateNum);
        }
        return highest;
      }, 0);
      
      const stateNumber = highestStateNumber + 1;
      const stateName = emptyState 
        ? `State ${stateNumber}`
        : (currentState.detectedChord 
            ? currentState.detectedChord 
            : `State ${stateNumber}`);
      
      // If emptyState is true, create a clean state with no notes
      const newStateData: FretboardState = emptyState ? {
        ...currentState,
        selectedNotes: [],
        rootNote: null,
        detectedChord: null
      } : { ...currentState };
      
      const newState: SavedFretboardState = {
        id,
        name: stateName,
        state: newStateData,
        drawingPoints: [...drawingPoints],
        createdAt: Date.now()
      };
      
      return [...prevStates, newState];
    });
    
    // Set this as the last loaded state
    lastLoadedStateId.current = newStateId;
    
    // Return the new state ID
    return newStateId;
  }, []);

  // Copy an existing state (without drawings)
  const copyState = useCallback((stateId: string) => {
    let newStateId = '';
    
    setSavedStates(prevStates => {
      // Find the state to copy
      const stateToCopy = prevStates.find(state => state.id === stateId);
      
      if (!stateToCopy) {
        return prevStates;
      }
      
      // Create a unique ID
      const id = `state-${Date.now()}`;
      newStateId = id;
      
      // Find the highest state number for naming
      const stateNumberPattern = /^State (\d+)$/;
      const highestStateNumber = prevStates.reduce((highest, state) => {
        const match = state.name.match(stateNumberPattern);
        if (match) {
          const stateNum = parseInt(match[1], 10);
          return Math.max(highest, stateNum);
        }
        return highest;
      }, 0);
      
      // Determine name for copied state
      let stateName;
      if (stateToCopy.state.detectedChord) {
        // If it's a chord, keep the chord name
        stateName = stateToCopy.state.detectedChord;
      } else if (stateToCopy.name.startsWith('State')) {
        // If it's a numbered state, create a new number
        stateName = `State ${highestStateNumber + 1}`;
      } else {
        // For custom named states, append "Copy"
        stateName = `${stateToCopy.name} Copy`;
      }
      
      // Create the new state with copied data but empty drawings
      const newState: SavedFretboardState = {
        id,
        name: stateName,
        state: { ...stateToCopy.state },
        drawingPoints: [], // Empty drawings for copy
        createdAt: Date.now()
      };
      
      return [...prevStates, newState];
    });
    
    // Return the new state ID
    return newStateId;
  }, []);

  // Update an existing state
  const updateState = useCallback((stateId: string, currentState: FretboardState, drawingPoints: DrawingPoint[]) => {
    setSavedStates(prevStates => {
      return prevStates.map(state => {
        if (state.id === stateId) {
          // Update name if chord detection has changed
          const name = currentState.detectedChord || state.name;
          
          return {
            ...state,
            name,
            state: { ...currentState },
            drawingPoints: [...drawingPoints],
          };
        }
        return state;
      });
    });
    
    return stateId;
  }, []);

  // Delete a state by its ID
  const deleteState = useCallback((stateId: string) => {
    let nextStateId: string | null = null;
    
    setSavedStates(prevStates => {
      // Find the index of the state to delete
      const indexToDelete = prevStates.findIndex(state => state.id === stateId);
      
      // If this is the last loaded state, select a new one
      if (lastLoadedStateId.current === stateId) {
        // If there's a previous state, select it
        if (indexToDelete > 0) {
          nextStateId = prevStates[indexToDelete - 1].id;
          lastLoadedStateId.current = nextStateId;
        } 
        // Otherwise, if there's a next state, select it
        else if (indexToDelete < prevStates.length - 1) {
          nextStateId = prevStates[indexToDelete + 1].id;
          lastLoadedStateId.current = nextStateId;
        }
        // If there's no other state, clear the selection
        else {
          lastLoadedStateId.current = null;
          nextStateId = null;
        }
      }
      
      return prevStates.filter(state => state.id !== stateId);
    });
    
    // Return the next state ID to load
    return nextStateId;
  }, []);

  // Reorder states based on new arrangement
  const reorderStates = useCallback((stateIds: string[]) => {
    setSavedStates(prevStates => {
      // Create a map of states by ID for quick lookup
      const stateMap = new Map(prevStates.map(state => [state.id, state]));
      
      // Create the reordered array
      const reorderedStates = stateIds
        .map(id => stateMap.get(id))
        .filter(state => state !== undefined) as SavedFretboardState[];
      
      // Ensure no states were lost during reordering
      if (reorderedStates.length !== prevStates.length) {
        // Some states are missing, return original array
        console.error('Reordering lost some states, aborting reorder');
        return prevStates;
      }
      
      return reorderedStates;
    });
  }, []);

  // Load a saved state
  const loadState = useCallback((stateId: string) => {
    const stateToLoad = savedStates.find(state => state.id === stateId);
    
    if (stateToLoad) {
      // Track the last loaded state ID
      lastLoadedStateId.current = stateId;
      return {
        state: { ...stateToLoad.state },
        drawingPoints: [...stateToLoad.drawingPoints]
      };
    }
    
    return null;
  }, [savedStates]);

  // Get the last loaded state 
  const getLastLoadedState = useCallback(() => {
    if (lastLoadedStateId.current && savedStates.length > 0) {
      const state = savedStates.find(s => s.id === lastLoadedStateId.current);
      return state ? {
        state: { ...state.state },
        drawingPoints: [...state.drawingPoints]
      } : null;
    }
    return null;
  }, [savedStates]);

  // Get sorted states (ensures consistent ordering)
  const getSortedStates = useCallback(() => {
    // With manual reordering, we now just return the states in their current order
    return [...savedStates];
  }, [savedStates]);

  // Add and select a state in one operation
  const addAndSelectState = useCallback((currentState: FretboardState, drawingPoints: DrawingPoint[], emptyState: boolean = false) => {
    // First prepare all the data for the new state
    const id = `state-${Date.now()}`;
    
    // Find the highest state number currently in use to avoid duplicates
    const stateNumberPattern = /^State (\d+)$/;
    const highestStateNumber = savedStates.reduce((highest, state) => {
      const match = state.name.match(stateNumberPattern);
      if (match) {
        const stateNum = parseInt(match[1], 10);
        return Math.max(highest, stateNum);
      }
      return highest;
    }, 0);
    
    const stateNumber = highestStateNumber + 1;
    const stateName = emptyState 
      ? `State ${stateNumber}`
      : (currentState.detectedChord 
          ? currentState.detectedChord 
          : `State ${stateNumber}`);
    
    // If emptyState is true, create a clean state with no notes
    const newStateData: FretboardState = emptyState ? {
      ...currentState,
      selectedNotes: [],
      rootNote: null,
      detectedChord: null
    } : { ...currentState };
    
    // Create the new state object
    const createdState: SavedFretboardState = {
      id,
      name: stateName,
      state: newStateData,
      drawingPoints: [...drawingPoints],
      createdAt: Date.now()
    };
    
    // Now add it to the saved states
    setSavedStates(prevStates => [...prevStates, createdState]);
    
    // Set this as the last loaded state right away
    lastLoadedStateId.current = id;
    
    // Return the result directly
    return { 
      newStateId: id, 
      loadedData: {
        state: newStateData,
        drawingPoints: drawingPoints
      }
    };
  }, [savedStates]);

  return {
    savedStates,
    sortedStates: getSortedStates(),
    addState,
    addAndSelectState,
    updateState,
    deleteState,
    copyState,
    reorderStates,
    loadState,
    getLastLoadedState,
    lastLoadedStateId: lastLoadedStateId.current
  };
}

export default useFretboardStates;