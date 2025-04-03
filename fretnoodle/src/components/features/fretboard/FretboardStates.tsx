// FILE: components/features/fretboard/FretboardStates.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { SavedFretboardState } from '../../../hooks/useFretboardStates';

interface FretboardStatesProps {
  savedStates: SavedFretboardState[];
  onAddState: () => void;
  onDeleteState: (stateId: string) => string | null;
  onLoadState: (stateId: string) => void;
  currentStateId: string | null;
}

const FretboardStates: React.FC<FretboardStatesProps> = ({
  savedStates,
  onAddState,
  onDeleteState,
  onLoadState,
  currentStateId
}) => {
  const theme = useTheme();
  
  // Internal state to track the actually selected state - critical fix
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(currentStateId);
  
  // Update internal state when prop changes
  useEffect(() => {
    setInternalSelectedId(currentStateId);
  }, [currentStateId]);
  
  // Auto-select a state when none is selected but states exist - ONLY ON FIRST RENDER
  useEffect(() => {
    if (savedStates.length > 0 && !internalSelectedId) {
      // Auto-select the first state when none is selected
      onLoadState(savedStates[0].id);
      setInternalSelectedId(savedStates[0].id);
    }
  }, [savedStates, internalSelectedId, onLoadState]);

  // Handle state deletion with confirmation for currently selected state
  const handleDeleteState = (stateId: string) => {
    const nextStateId = onDeleteState(stateId);
    
    // If we have a next state ID, update our internal selection
    if (nextStateId) {
      setInternalSelectedId(nextStateId);
    } else {
      setInternalSelectedId(null);
    }
  };
  
  // Custom state loading function that also updates internal selection
  const handleLoadState = (stateId: string) => {
    setInternalSelectedId(stateId);
    onLoadState(stateId);
  };
  
  // Custom add state function
  const handleAddState = () => {
    // First call parent handler
    onAddState();
    
    // Locate the newly added state (should be the last one)
    if (savedStates.length > 0) {
      // Give React time to update the state list
      setTimeout(() => {
        // The new state should be the last one in the array
        const newState = savedStates[savedStates.length - 1];
        if (newState) {
          setInternalSelectedId(newState.id);
          onLoadState(newState.id);
        }
      }, 50);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1002,
        backgroundColor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 3,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* State buttons with delete buttons below them */}
      {savedStates.map((state) => (
        <Stack 
          key={state.id} 
          alignItems="center" 
          justifyContent="center"
          spacing={0.5}
        >
          <Button
            data-state-id={state.id}
            variant="contained"
            onClick={() => handleLoadState(state.id)}
            sx={{ 
              minWidth: '100px',
              textTransform: 'none',
              // Use internal state for highlighting
              backgroundColor: internalSelectedId === state.id ? 'primary.dark' : 'primary.main',
              border: internalSelectedId === state.id ? `2px solid ${theme.palette.secondary.main}` : 'none',
              '&:hover': {
                backgroundColor: internalSelectedId === state.id ? 'primary.dark' : undefined,
              }
            }}
          >
            {state.name}
          </Button>
          <Button
            color="error"
            size="small"
            onClick={() => handleDeleteState(state.id)}
            sx={{ 
              minWidth: 'unset',
              width: '24px',
              height: '24px',
              padding: 0
            }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Stack>
      ))}
      
      {/* Add State button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddState}
        sx={{ 
          height: '36px', 
          textTransform: 'none' 
        }}
      >
        Add State
      </Button>
    </Box>
  );
};

export default FretboardStates;