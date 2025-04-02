import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { SavedFretboardState } from '../../../hooks/useFretboardStates';

interface FretboardStatesProps {
  savedStates: SavedFretboardState[];
  onAddState: () => void;
  onDeleteState: (stateId: string) => void;
  onLoadState: (stateId: string) => void;
}

const FretboardStates: React.FC<FretboardStatesProps> = ({
  savedStates,
  onAddState,
  onDeleteState,
  onLoadState
}) => {
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
            variant="contained"
            onClick={() => onLoadState(state.id)}
            sx={{ 
              minWidth: '100px',
              textTransform: 'none'
            }}
          >
            {state.name}
          </Button>
          <Button
            color="error"
            size="small"
            onClick={() => onDeleteState(state.id)}
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
        onClick={onAddState}
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