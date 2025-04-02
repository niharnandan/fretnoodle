import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  useMediaQuery, 
  useTheme, 
  Tabs, 
  Tab,
  Button,
  Divider,
  Chip
} from '@mui/material';
import FretboardVisualizer from '../components/features/fretboard/FretboardVisualizer';
import FretboardControls from '../components/features/fretboard/FretboardControls';
import TuningDialog from '../components/features/fretboard/TuningDialog';
import useFretboard from '../hooks/useFretboard';
import { FretboardState } from '../types/fretboard';

const Fretboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tuningDialogOpen, setTuningDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [lastLoadedState, setLastLoadedState] = useState<FretboardState | null>(null);
  
  const {
    fretboardState,
    changeTuning,
    resetTuning,
    setAlternateTuning,
    setCapo,
    highlightNotes,
    highlightFrets,
    toggleOption,
    toggleNoteSelection,
    clearSelectedNotes
  } = useFretboard();
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleOpenTuningDialog = () => {
    setTuningDialogOpen(true);
  };
  
  const handleCloseTuningDialog = () => {
    setTuningDialogOpen(false);
  };
  
  // Handle loading a state from the fullscreen visualizer
  const handleStateLoad = (loadedState: FretboardState) => {
    // Store the loaded state
    setLastLoadedState(loadedState);
    
    // Apply the loaded state to the current fretboard
    // This will update all required state properties at once
    Object.keys(loadedState).forEach(key => {
      const typedKey = key as keyof FretboardState;
      switch(typedKey) {
        case 'tuning':
          // Apply each tuning note individually to ensure full sync
          loadedState.tuning.forEach((note, index) => {
            while (fretboardState.tuning[index] !== note) {
              changeTuning(index, 'up');
            }
          });
          break;
        case 'capo':
          setCapo(loadedState.capo);
          break;
        case 'highlightedNotes':
          highlightNotes(loadedState.highlightedNotes);
          break;
        case 'highlightedFrets':
          highlightFrets(loadedState.highlightedFrets);
          break;
        case 'selectedNotes':
          // Clear existing notes and add new ones
          clearSelectedNotes();
          loadedState.selectedNotes.forEach(note => {
            toggleNoteSelection(note.string, note.fret);
          });
          break;
        case 'showIntervals':
        case 'showNotes':
        case 'showOctaves':
        case 'showDots':
          // Only toggle if the current value doesn't match the loaded state
          if (fretboardState[typedKey] !== loadedState[typedKey]) {
            toggleOption(typedKey);
          }
          break;
        // Root note and detectedChord are derived from selectedNotes, so we don't need to set them
      }
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Guitar Fretboard Visualizer
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph align="center">
        Explore the guitar fretboard, visualize notes, and experiment with different tunings
      </Typography>
      
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip 
            label={
              fretboardState.detectedChord
              ? `Detected Chord: ${fretboardState.detectedChord}`
              : 'If notes match up to a chord, it\'ll show up here!'} 
            color="primary" 
            variant="filled" 
            size='medium'
            sx={{ fontSize: '1.1rem', py: 1 }}
          />
        </Box>
      
      {isMobile && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Fretboard" />
          <Tab label="Controls" />
        </Tabs>
      )}
      
      {(!isMobile || activeTab === 0) && (
        <Paper elevation={3} sx={{ p: 1, mb: 3, overflowX: 'auto' }}>
            <FretboardVisualizer 
              fretboardState={fretboardState}
              width={isMobile ? 900 : 1200}
              height={isMobile ? 250 : 300}
              onNoteClick={toggleNoteSelection}
              onStateLoad={handleStateLoad}
            />
        </Paper>
      )}
      
      {(!isMobile || activeTab === 1) && (
        <FretboardControls
          fretboardState={fretboardState}
          onToggleOption={toggleOption}
          onOpenTuningDialog={handleOpenTuningDialog}
          onSetCapo={setCapo}
          onHighlightNotes={highlightNotes}
          onClearSelectedNotes={clearSelectedNotes}
        />
      )}
      
      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          How to Use the Fretboard Visualizer
        </Typography>
        
        <Typography variant="body1" paragraph>
          • Click on individual notes to select them and build chords
        </Typography>
        
        <Typography variant="body1" paragraph>
          • Explore notes across the fretboard with visual highlighting
        </Typography>
        
        <Typography variant="body1" paragraph>
          • Change tuning to see how different tunings affect note positions
        </Typography>
        
        <Typography variant="body1" paragraph>
          • Add a capo to see how it changes the effective notes
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => highlightNotes(['C', 'E', 'G'])}
          >
            Try C Major
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setAlternateTuning('drop d')}
          >
            Try Drop D Tuning
          </Button>
          
          {fretboardState.selectedNotes.length > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearSelectedNotes}
            >
              Clear Selected Notes
            </Button>
          )}
        </Box>
      </Paper>
      
      <TuningDialog
        open={tuningDialogOpen}
        tuning={fretboardState.tuning}
        onClose={handleCloseTuningDialog}
        onChangeTuning={changeTuning}
        onResetTuning={resetTuning}
        onSetAlternateTuning={setAlternateTuning}
      />
    </Container>
  );
};

export default Fretboard;