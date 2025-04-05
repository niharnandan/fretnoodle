import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  Typography, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  SelectChangeEvent // import the type for the select change event
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface TuningDialogProps {
  open: boolean;
  tuning: string[];
  onClose: () => void;
  onChangeTuning: (stringIndex: number, direction: 'up' | 'down') => void;
  onResetTuning: () => void;
  onSetAlternateTuning: (tuningName: string) => void;
}

const TuningDialog: React.FC<TuningDialogProps> = ({
  open,
  tuning,
  onClose,
  onChangeTuning,
  onResetTuning,
  onSetAlternateTuning
}) => {
  // Update the event type to `SelectChangeEvent<string>`
  const handleTuningPresetChange = (event: SelectChangeEvent<string>) => {
    onSetAlternateTuning(event.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Change Guitar Tuning
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Adjust the tuning for each string. The thinnest string (high E) is at the top,
          and the thickest string (low E) is at the bottom.
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="tuning-preset-label">Common Tunings</InputLabel>
          <Select
            labelId="tuning-preset-label"
            id="tuning-preset"
            label="Common Tunings"
            onChange={handleTuningPresetChange}
            defaultValue=""
          >
            <MenuItem value="standard">Standard (E A D G B E)</MenuItem>
            <MenuItem value="drop d">Drop D (D A D G B E)</MenuItem>
            <MenuItem value="half step down">Half Step Down (Eb Ab Db Gb Bb Eb)</MenuItem>
            <MenuItem value="full step down">Full Step Down (D G C F A D)</MenuItem>
            <MenuItem value="open g">Open G (D G D G B D)</MenuItem>
            <MenuItem value="dadgad">DADGAD (D A D G A D)</MenuItem>
          </Select>
        </FormControl>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Individual String Tuning
        </Typography>
        
        {[...tuning].reverse().map((note, index) => {
          // Calculate the actual string number (1-6) and the actual index in the tuning array
          const stringNumber = index + 1; // String 1 (thinnest) to String 6 (thickest)
          const actualIndex = tuning.length - 1 - index; // Convert to original array index
          
          return (
            <Grid 
              container 
              spacing={2} 
              alignItems="center" 
              key={actualIndex} 
              sx={{ mb: 1 }}
            >
              <Grid>
                <Typography variant="body1">
                  String {7-stringNumber}: {stringNumber === 1 ? '(thickest)' : stringNumber === 6 ? '(thinnest)' : ''}
                </Typography>
              </Grid>
              
              <Grid>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => onChangeTuning(actualIndex, 'down')}
                >
                  <RemoveIcon />
                </Button>
              </Grid>
              
              <Grid>
                <Typography variant="h6" align="center">
                  {note}
                </Typography>
              </Grid>
              
              <Grid>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => onChangeTuning(actualIndex, 'up')}
                >
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
          );
        })}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onResetTuning} color="secondary">
          Reset to Standard
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TuningDialog;