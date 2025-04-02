import React, { useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Grid, 
  Button, 
  FormControlLabel, 
  Switch,
  Slider,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TuneIcon from '@mui/icons-material/Tune';
import { FretboardState } from '../../../types/fretboard';
import { commonChords } from '../../../types/commonChords';

interface FretboardControlsProps {
  fretboardState: FretboardState;
  onToggleOption: (option: 'showNotes' | 'showOctaves' | 'showDots') => void;
  onOpenTuningDialog: () => void;
  onSetCapo: (position: number) => void;
  onHighlightNotes: (notes: string[]) => void;
  onClearSelectedNotes: () => void; // Added this prop for clearing all selected notes
}

const FretboardControls: React.FC<FretboardControlsProps> = ({
  fretboardState,
  onToggleOption,
  onOpenTuningDialog,
  onSetCapo,
  onHighlightNotes,
  onClearSelectedNotes
}) => {
  const { showNotes, showOctaves, showDots, capo } = fretboardState;
  
  const handleCapoChange = (_event: Event, value: number | number[]) => {
    onSetCapo(value as number);
  };

  const clearSelection = useCallback(() => {
    onHighlightNotes([]);
    onClearSelectedNotes();
  }, [])
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid>
          <Typography variant="subtitle1" gutterBottom>
            Display Options
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={showNotes} 
                onChange={() => onToggleOption('showNotes')} 
                color="primary"
              />
            }
            label="Show Notes"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={showOctaves} 
                onChange={() => onToggleOption('showOctaves')} 
                color="primary"
              />
            }
            label="Show Octaves"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={showDots} 
                onChange={() => onToggleOption('showDots')} 
                color="primary"
              />
            }
            label="Show Fret Markers"
          />
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<TuneIcon />}
            onClick={onOpenTuningDialog}
            fullWidth
            sx={{ mt: 2 }}
          >
            Change Tuning
          </Button>
        </Grid>
        
        <Grid>
          <Typography variant="subtitle1" gutterBottom>
            Capo Position
          </Typography>
          
          <Box sx={{ px: 2 }}>
            <Slider
              value={capo}
              onChange={handleCapoChange}
              step={1}
              marks
              min={0}
              max={12}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            {capo === 0 ? 'No Capo' : `Capo on fret ${capo}`}
          </Typography>
        </Grid>
        <Grid>
        <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={clearSelection}
              sx={{ mb: 1 }}
            >
              Clear All Selections
            </Button>
          <Typography variant="subtitle1" gutterBottom>
            Current Tuning
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            p: 1, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 1,
            mb: 2
          }}>
            {fretboardState.tuning.slice().reverse().map((note, index) => (
              <Chip 
                key={index} 
                label={note} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            ))}
          </Box>
        </Grid>
        
        <Grid>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" gutterBottom>
            Highlight Chord
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {commonChords.map((chord) => (
              <Button
                key={chord.name}
                variant="outlined"
                size="small"
                startIcon={<MusicNoteIcon />}
                onClick={() => onHighlightNotes(chord.notes)}
                sx={{ mb: 1 }}
              >
                {chord.name}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FretboardControls;