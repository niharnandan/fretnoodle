import { useState, useCallback, useRef } from 'react';
import { FretboardState } from '../types/fretboard';

export interface SavedFretboardState {
  id: string;
  name: string;
  state: FretboardState;
}

export function useFretboardStates() {
  const [savedStates, setSavedStates] = useState<SavedFretboardState[]>([]);
  // Track the last loaded state ID
  const lastLoadedStateId = useRef<string | null>(null);

  // Add a new state
  const addState = useCallback((currentState: FretboardState) => {
    setSavedStates(prevStates => {
      // Create a unique ID
      const id = `state-${Date.now()}`;
      
      // Determine name based on the detected chord or use default naming scheme
      const stateName = currentState.detectedChord 
        ? currentState.detectedChord 
        : `State ${prevStates.length + 1}`;
      
      const newState: SavedFretboardState = {
        id,
        name: stateName,
        state: { ...currentState }
      };
      
      return [...prevStates, newState];
    });
  }, []);

  // Delete a state by its ID
  const deleteState = useCallback((stateId: string) => {
    setSavedStates(prevStates => 
      prevStates.filter(state => state.id !== stateId)
    );
    
    // Clear the lastLoadedStateId if it's being deleted
    if (lastLoadedStateId.current === stateId) {
      lastLoadedStateId.current = null;
    }
  }, []);

  // Load a saved state
  const loadState = useCallback((stateId: string) => {
    const stateToLoad = savedStates.find(state => state.id === stateId);
    
    if (stateToLoad) {
      // Track the last loaded state ID
      lastLoadedStateId.current = stateId;
      return { ...stateToLoad.state };
    }
    
    return null;
  }, [savedStates]);

  // Get the last loaded state 
  const getLastLoadedState = useCallback(() => {
    if (lastLoadedStateId.current && savedStates.length > 0) {
      const state = savedStates.find(s => s.id === lastLoadedStateId.current);
      return state ? { ...state.state } : null;
    }
    return null;
  }, [savedStates]);

  return {
    savedStates,
    addState,
    deleteState,
    loadState,
    getLastLoadedState,
    lastLoadedStateId: lastLoadedStateId.current
  };
}

export default useFretboardStates;