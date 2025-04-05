import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TuneIcon from '@mui/icons-material/Tune';
import BrushIcon from '@mui/icons-material/Brush';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const HowTo: React.FC = () => {
  const theme = useTheme();
  
  const KeyboardShortcut = ({ shortcut, description }: { shortcut: string, description: string }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 1.5 
    }}>
      <Chip 
        label={shortcut} 
        color="primary" 
        sx={{ 
          mr: 2, 
          fontFamily: 'monospace', 
          fontWeight: 'bold',
          minWidth: '40px'
        }} 
      />
      <Typography variant="body1">{description}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        FretNoodle - How To Guide
      </Typography>
      
      <Stack spacing={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Welcome to the Guitar Fretboard Visualizer
          </Typography>
          <Typography variant="body1" paragraph>
            FretNoodle is an interactive tool designed to help guitarists of all levels visualize the fretboard, 
            understand note relationships, explore chord shapes, and experiment with different tunings.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're learning music theory, practicing scales, or just exploring new chord voicings, 
            this visualizer will help you see patterns and relationships across the fretboard.
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Card elevation={3} sx={{ flex: 1, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MusicNoteIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h5">Basic Features</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MusicNoteIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Note Selection" 
                    secondary="Click on any note on the fretboard to select it. Click again to deselect."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TuneIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tuning Adjustments" 
                    secondary="Change individual string tunings or select from preset tunings like Drop D or Open G."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Chord Detection" 
                    secondary="Select three or more notes to automatically detect standard chord names."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Card elevation={3} sx={{ flex: 1, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FullscreenIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h5">Advanced Features</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FullscreenIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fullscreen Mode" 
                    secondary="Enter fullscreen mode for a more immersive experience with state saving."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <BrushIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Drawing Mode" 
                    secondary="In fullscreen mode, toggle drawing mode to annotate the fretboard with custom markings."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SaveIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="State Management" 
                    secondary="Save multiple fretboard states to quickly switch between different chord and scale patterns."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <KeyboardIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5">Keyboard Shortcuts</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <KeyboardShortcut shortcut="F" description="Toggle fullscreen mode" />
              <KeyboardShortcut shortcut="D" description="Toggle drawing mode (in fullscreen)" />
              <KeyboardShortcut shortcut="Esc" description="Exit fullscreen mode" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                While in fullscreen mode, use the state management buttons at the bottom of the screen to save and recall different fretboard states.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DeleteIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Use the "Clear All Selections" button to reset the current state.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Frequently Asked Questions</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">How do I save my fretboard setups?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Enter fullscreen mode by clicking the "Fullscreen Mode" checkbox or pressing the F key. Once in fullscreen mode, 
                you'll see an "Add State" button at the bottom of the screen. Click this to save your current fretboard setup. 
                You can save multiple states and switch between them.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">How does chord detection work?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The visualizer automatically detects common chord patterns when you select three or more notes on the fretboard. 
                The detected chord name will appear at the top of the screen. The system recognizes standard major, minor, 7th, and other 
                common chord types. For best results, select notes that form a standard chord voicing.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">What is drawing mode used for?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Drawing mode allows you to make freehand annotations on the fretboard. This is useful for marking scale patterns, 
                connection routes between notes, or any other visual aid you might need. To use it, enter fullscreen mode and press 
                the D key or click the "Drawing Mode" option in the control panel. Your drawings are saved with each state.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Can I see intervals between selected notes?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes! When you select multiple notes, the first selected note is considered the root note. The intervals relative 
                to this root note are displayed on each selected note. This helps you understand the harmonic relationship between 
                the notes in your selection.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 150, 136, 0.08)' : 'rgba(0, 150, 136, 0.04)' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#00897b' }}>Pro Tips & Tricks</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Card elevation={2} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">Visualizing Scales</Typography>
                <Typography variant="body2">
                  Save different scale patterns as states in fullscreen mode. Use drawing mode to connect the notes
                  and create visual pathways for practicing scale runs. This is especially helpful for visualizing modes
                  and understanding how they relate to the parent scale.
                </Typography>
              </CardContent>
            </Card>
            
            <Card elevation={2} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">Alternate Tunings</Typography>
                <Typography variant="body2">
                  When exploring alternate tunings, save a state for each tuning you're working with. This allows you
                  to quickly compare how chord shapes and note relationships change across different tunings without
                  having to manually retune each time.
                </Typography>
              </CardContent>
            </Card>
            
            <Card elevation={2} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary">Chord Inversions</Typography>
                <Typography variant="body2">
                  Use the visualizer to explore different chord inversions. Select the notes of a chord in different
                  octave positions to see how the interval relationships change. This is a great way to discover new
                  voicings and understand how to connect chords smoothly in progressions.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default HowTo;