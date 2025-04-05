import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Stack, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { SavedFretboardState } from '../../../hooks/useFretboardStates';

interface FretboardStatesProps {
  savedStates: SavedFretboardState[];
  onAddState: () => void;
  onDeleteState: (stateId: string) => string | null;
  onLoadState: (stateId: string) => void;
  onCopyState: (stateId: string) => void;
  onReorderStates: (stateIds: string[]) => void;
  currentStateId: string | null;
}

const FretboardStates: React.FC<FretboardStatesProps> = ({
  savedStates,
  onAddState,
  onDeleteState,
  onLoadState,
  onCopyState,
  onReorderStates,
  currentStateId
}) => {
  const theme = useTheme();
  
  // Internal state to track the actually selected state - critical fix
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(currentStateId);
  
  // Track drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const stateContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Copy state function
  const handleCopyState = (stateId: string) => {
    onCopyState(stateId);
  };
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      // Create a new array of state IDs in the new order
      const newOrder = [...savedStates];
      const [draggedState] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dragOverIndex, 0, draggedState);
      
      // Get the IDs in the new order
      const newOrderIds = newOrder.map(state => state.id);
      
      // Call the handler to update the parent component
      onReorderStates(newOrderIds);
    }
    
    // Reset drag state
    setDraggedIndex(null);
    setDragOverIndex(null);
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
      ref={stateContainerRef}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          maxWidth: '70vw',
          pb: 1
        }}
      >
        {savedStates.map((state, index) => (
          <Stack 
            key={state.id} 
            alignItems="center" 
            justifyContent="center"
            spacing={0.5}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            sx={{
              cursor: 'grab',
              opacity: draggedIndex === index ? 0.5 : 1,
              borderBottom: dragOverIndex === index ? `2px solid ${theme.palette.primary.main}` : 'none',
              padding: '4px',
              backgroundColor: dragOverIndex === index ? 'rgba(0,0,0,0.05)' : 'transparent',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Button
              data-state-id={state.id}
              variant="contained"
              onClick={() => handleLoadState(state.id)}
              sx={{ 
                minWidth: '100px',
                textTransform: 'none',
                // Changed styling for selected state button - green with white outline
                backgroundColor: internalSelectedId === state.id ? '#2e7d32' : 'primary.main', // Using green.700 color
                border: internalSelectedId === state.id ? `2px solid white` : 'none',
                '&:hover': {
                  backgroundColor: internalSelectedId === state.id ? '#1b5e20' : undefined, // Darker green on hover
                }
              }}
            >
              {state.name}
            </Button>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                color="primary"
                size="small"
                onClick={() => handleCopyState(state.id)}
                sx={{ 
                  minWidth: 'unset',
                  width: '24px',
                  height: '24px',
                  padding: 0
                }}
              >
                <ContentCopyIcon fontSize="small" />
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
              <DragIndicatorIcon 
              fontSize="small" 
              sx={{ 
                cursor: 'grab',
                color: 'text.secondary',
                mb: -0.5
              }} 
            />
            </Box>
          </Stack>
        ))}
      </Box>
      
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddState}
        sx={{ 
          height: '36px', 
          textTransform: 'none',
          flexShrink: 0
        }}
      >
        Add State
      </Button>
    </Box>
  );
};

export default FretboardStates;